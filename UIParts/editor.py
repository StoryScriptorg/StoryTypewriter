import wx
import wx.lib.agw.aui
import tkinter as tk
from PIL import ImageTk, Image
from UIParts.data import *

class EditorTab(wx.Panel):
	def __init__(self, parent, file):
		super(EditorTab, self).__init__(parent)

		self.text = wx.StaticText(self, label=f"Opening {file}")
		self.file = file

class EditorFrame(wx.Frame):
	def __init__(self, parent, title):
		super(EditorFrame, self).__init__(parent, title=title, size=(800, 600))
		self.SetIcon(wx.Icon("Resources\\StoryTypewriter_256x256.png"))

		self.InitUI()

	def InitUI(self):
		self.panel = wx.Panel(self)
		menubar = wx.MenuBar()
		fileMenu = wx.Menu()
		quit = wx.MenuItem(fileMenu, id=1, text="Quit\tCtrl+F4")
		fileMenu.Append(quit)
		self.Bind(wx.EVT_MENU, self.OnQuit, quit)
		menubar.Append(fileMenu, "&File")

		helpMenu = wx.Menu()
		about = wx.MenuItem(helpMenu, id=2, text="About")
		helpMenu.Append(about)
		self.Bind(wx.EVT_MENU, self.aboutWindow, about)
		menubar.Append(helpMenu, "&Help")
		
		self.SetMenuBar(menubar)

		self.notebook = wx.lib.agw.aui.auibook.AuiNotebook(self.panel, agwStyle=wx.lib.agw.aui.auibook.AUI_NB_CLOSE_ON_ALL_TABS)
		self.Bind(wx.lib.agw.aui.auibook.EVT_AUINOTEBOOK_PAGE_CHANGED, self.OnTabChanged, self.notebook)

		editorTab = EditorTab(self.notebook, "OwO.txt")
		editorTab2 = EditorTab(self.notebook, "UwU.docx")
		editorTab3 = EditorTab(self.notebook, "XwX.py")
		editorTab4 = EditorTab(self.notebook, "StoryScripte.sts")

		self.notebook.AddPage(editorTab, "Tab 1")
		self.notebook.SetCloseButton(0, False)
		self.notebook.AddPage(editorTab2, "Tab 2")
		self.notebook.AddPage(editorTab3, "Tab 3")
		self.notebook.AddPage(editorTab4, "Tab 4")

		self.dirTree = wx.GenericDirCtrl(self.panel, dir="D:\\Projects\\StoryTypewriter")

		sizer = wx.BoxSizer()
		sizer.Add(self.dirTree, 1, wx.EXPAND)
		sizer.Add(self.notebook, 4, wx.EXPAND)
		self.panel.SetSizer(sizer)

	def OnQuit(self, event):
		self.Close()

	def OnTabChanged(self, event):
		self.SetTitle(f"{self.notebook.GetCurrentPage().file} - StoryTypewriter")

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
		win.mainloop()

class EditorApplication(wx.App):
	def OnInit(self):
		self.frame = EditorFrame(parent=None, title="Untitled - StoryTypewriter")
		self.frame.Show()

		return True