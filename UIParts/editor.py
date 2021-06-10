import wx
import wx.lib.agw.aui
import tkinter as tk
from PIL import ImageTk, Image
from UIParts.data import *

class PlainTab(wx.Panel):
	def __init__(self, parent, eI):
		"""
		[parameter] eI = Editor Class instance
		"""
		super(PlainTab, self).__init__(parent)

		self.smallFont = wx.Font(10, wx.MODERN, wx.NORMAL, wx.NORMAL, False, "Segoe UI")
		self.newFileButton = wx.Button(self, label="New file", pos=(20, 50))
		self.openFileButton = wx.Button(self, label="Open File", pos=(20, 80))
		self.openFolderButton = wx.Button(self, label="Open Folder", pos=(20, 110))
		eI.Bind(wx.EVT_BUTTON, eI.NewFile, self.newFileButton)
		eI.Bind(wx.EVT_BUTTON, eI.OpenFile, self.openFileButton)
		eI.Bind(wx.EVT_BUTTON, eI.OpenFolder, self.openFolderButton)
		self.file = "Welcome"

	def getFileName(self): return self.file
	def refreshTextbox(self): pass

class EditorTab(wx.Panel):
	""" Text editor tab """
	def __init__(self, parent, eI, file=None):
		super(EditorTab, self).__init__(parent)

		self.jetbrainsMono = wx.Font(11, wx.MODERN, wx.NORMAL, wx.NORMAL, False, "JetBrains Mono")
		self.textInput = wx.TextCtrl(self, style=wx.TE_MULTILINE)
		self.textInput.SetFont(self.jetbrainsMono)
		self.file = file
		sizer = wx.BoxSizer()
		sizer.Add(self.textInput, 1, wx.EXPAND)
		self.SetSizer(sizer)
		self.eI = eI

	def getFileName(self):
		if self.file:
			return self.file
		else: return "Untitled"

	def refreshTextbox(self):
		if not self.textInput.IsModified():
			if self.file != "Untitled":
				self.eI.statusBar.SetStatusText(f"Reloading {self.file}")
				self.textInput.LoadFile(self.file)
				self.eI.statusBar.SetStatusText("Ready")

	def writeChangesToFile(self, saveAsDifferentFile=False):
		if saveAsDifferentFile or self.file == "Untitled":
			with wx.FileDialog(self, "Open StoryScript file", wildcard="StoryScript files (*.sts)|*.sts|All files (*.*)|*.*",
					   style=wx.FD_SAVE) as fileDialog:

				if fileDialog.ShowModal() == wx.ID_CANCEL:
					return	# the user changed their mind

				# Proceed loading the file chosen by the user
				pathname = fileDialog.GetPath()
			self.file = pathname
			self.eI.statusBar.SetStatusText(f"Saving {self.file}")
			self.textInput.SaveFile(self.file)
			self.eI.statusBar.SetStatusText("Ready")
		else:
			self.eI.statusBar.SetStatusText(f"Saving {self.file}")
			self.textInput.SaveFile(self.file)
			self.eI.statusBar.SetStatusText("Ready")

class EditorFrame(wx.Frame):
	def __init__(self, parent, title):
		super(EditorFrame, self).__init__(parent, title=title, size=(800, 600))
		self.SetIcon(wx.Icon("Resources\\StoryTypewriter_256x256.png"))

		self.smallFont = wx.Font(10, wx.MODERN, wx.NORMAL, wx.NORMAL, False, "Segoe UI")
		self.InitUI()

	def InitUI(self):
		self.panel = wx.Panel(self)
		menubar = wx.MenuBar()
		fileMenu = wx.Menu()
		menu = wx.MenuItem(fileMenu, id=1, text="New file\tCtrl+N")
		fileMenu.Append(menu)
		self.Bind(wx.EVT_MENU, self.NewFile, menu)
		menu = wx.MenuItem(fileMenu, id=2, text="Open File\tCtrl+O")
		fileMenu.Append(menu)
		self.Bind(wx.EVT_MENU, self.OpenFile, menu)
		menu = wx.MenuItem(fileMenu, id=3, text="Open Folder\tAlt+O")
		fileMenu.Append(menu)
		self.Bind(wx.EVT_MENU, self.OpenFolder, menu)
		menu = wx.MenuItem(fileMenu, id=3, text="Save file\tCtrl+S")
		fileMenu.Append(menu)
		self.Bind(wx.EVT_MENU, self.SaveFile, menu)
		menu = wx.MenuItem(fileMenu, id=5, text="Quit\tCtrl+F4")
		fileMenu.Append(menu)
		self.Bind(wx.EVT_MENU, self.OnQuit, menu)
		menubar.Append(fileMenu, "&File")

		# Creating an Accelerator table
		newfile = wx.NewId()
		openFolder = wx.NewId()
		openFile = wx.NewId()
		self.Bind(wx.EVT_MENU, self.NewFile, id=newfile)
		self.Bind(wx.EVT_MENU, self.OpenFolder, id=openFolder)
		self.Bind(wx.EVT_MENU, self.OpenFile, id=openFile)
		self.accel_table = wx.AcceleratorTable([(wx.ACCEL_CTRL, ord('N'), newfile),
												(wx.ACCEL_ALT, ord('O'), openFolder),
												(wx.ACCEL_CTRL, ord('O'), openFile)])

		helpMenu = wx.Menu()
		about = wx.MenuItem(helpMenu, id=6, text="About")
		helpMenu.Append(about)
		self.Bind(wx.EVT_MENU, self.aboutWindow, about)
		menubar.Append(helpMenu, "&Help")
		
		self.SetMenuBar(menubar)

		self.notebook = wx.lib.agw.aui.auibook.AuiNotebook(self.panel, agwStyle=wx.lib.agw.aui.auibook.AUI_NB_CLOSE_ON_ALL_TABS)
		self.notebook.SetFont(self.smallFont)
		self.Bind(wx.lib.agw.aui.auibook.EVT_AUINOTEBOOK_PAGE_CHANGED, self.OnTabChanged, self.notebook)

		plainTab = PlainTab(self.notebook, self)
		self.editorTabs = []

		self.notebook.AddPage(plainTab, "Welcome")
		self.notebook.SetCloseButton(0, False)

		self.dirTree = wx.GenericDirCtrl(self.panel, dir="D:\\Projects\\StoryTypewriter")

		sizer = wx.BoxSizer()
		sizer.Add(self.dirTree, 1, wx.EXPAND)
		sizer.Add(self.notebook, 4, wx.EXPAND)
		self.panel.SetSizer(sizer)

		self.statusBar = self.CreateStatusBar(style=wx.BORDER_NONE)
		self.statusBar.SetStatusText("Ready")

	def OnQuit(self, event):
		self.Close()

	def OnTabChanged(self, event):
		self.SetTitle(f"{self.notebook.GetCurrentPage().getFileName()} - StoryTypewriter")
		self.notebook.GetCurrentPage().refreshTextbox()

	def NewFile(self, event):
		self.editorTabs.append(EditorTab(self.notebook, self, "Untitled"))
		self.notebook.AddPage(self.editorTabs[len(self.editorTabs) - 1], "Untitled")

	def SaveFile(self, event):
		self.notebook.GetCurrentPage().writeChangesToFile()

	def OpenFile(self, event):
		with wx.FileDialog(self, "Open StoryScript file", wildcard="StoryScript files (*.sts)|*.sts|All files (*.*)|*.*",
					   style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST) as fileDialog:

			if fileDialog.ShowModal() == wx.ID_CANCEL:
				return	# the user changed their mind

			# Proceed loading the file chosen by the user
			pathname = fileDialog.GetPath()
		self.editorTabs.append(EditorTab(self.notebook, self, pathname))
		self.notebook.AddPage(self.editorTabs[len(self.editorTabs) - 1], pathname)
		self.editorTabs[len(self.editorTabs) - 1].refreshTextbox()

	def OpenFolder(self, event):
		dlg = wx.DirDialog(
			self, message="Choose the Wanted folder.",
			style=wx.DD_DEFAULT_STYLE)

		# Show the dialog and retrieve the user response.
		if dlg.ShowModal() == wx.ID_OK:
			# load directory
			path = dlg.GetPath()
		else:
			path = ""

		# Destroy the dialog.
		dlg.Destroy()
		self.dirTree.SetPath(path)

	def aboutWindow(self, event):
		win = tk.Tk()
		win.title("About")
		icon = Image.open("Resources\\StoryTypewriter_256x256.png")
		icon = icon.resize((64, 64), Image.ANTIALIAS)
		icontk = ImageTk.PhotoImage(icon)
		win.iconphoto(False, icontk)
		label1 = tk.Label(image=icontk)
		label1.pack(side=tk.TOP, pady=(5, 0))
		label2 = tk.Label(win, text="StoryTypewriter", font=("Segoe UI", 14, "bold"))
		label2.pack(side=tk.TOP, padx=10, pady=10)
		label3 = tk.Label(win, text=f"Python version: {python_version}", font=("Segoe UI", 10))
		label3.pack(side=tk.BOTTOM, padx=10, pady=(5, 15))
		label4 = tk.Label(win, text=f"StoryTypewriter Version: {storytypewriter_version}", font=("Segoe UI", 10))
		label4.pack(side=tk.BOTTOM, padx=10, pady=(5, 1.25))
		label5 = tk.Label(win, text=f"StoryScript Version: {storyscript_version}", font=("Segoe UI", 10))
		label5.pack(side=tk.BOTTOM, padx=10, pady=(5, 1.25))
		label5 = tk.Label(win, text=f"OS Version: {os_version}", font=("Segoe UI", 10))
		label5.pack(side=tk.BOTTOM, padx=10, pady=(5, 1.25))
		label6 = tk.Label(win, text=f"WxPython version: {wx_version}", font=("Segoe UI", 10))
		label6.pack(side=tk.BOTTOM, padx=10, pady=(5, 1.25))
		label7 = tk.Label(win, text=f"Tkinter version: {tk_version}", font=("Segoe UI", 10))
		label7.pack(side=tk.BOTTOM, padx=10, pady=(5, 1.25))
		win.mainloop()

class EditorApplication(wx.App):
	def OnInit(self):
		self.frame = EditorFrame(parent=None, title="Untitled - StoryTypewriter")
		self.frame.Show()

		return True