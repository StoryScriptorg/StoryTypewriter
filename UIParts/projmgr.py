""" - StoryTypewriter Welcome Window - """
import wx

class WelcomePanel(wx.Panel):
	def __init__(self, parent):
		super(WelcomePanel, self).__init__(parent)

		self.bfontObj = wx.Font(12, wx.MODERN, wx.BOLD, wx.BOLD, False, "Segoe UI")
		self.smallerNFontObj = wx.Font(10, wx.MODERN, wx.NORMAL, wx.NORMAL, False, "Segoe UI")

		self.title = wx.StaticText(self, label="StoryTypewriter", pos=(20, 15))
		self.title.SetFont(self.bfontObj)

		self.newFile = wx.Button(self, label="New File", pos=(25, 60), size=(100, 25))
		self.newFile.SetFont(self.smallerNFontObj)
		self.openFolder = wx.Button(self, label="Open Folder", pos=(25, 100), size=(100, 25))
		self.openFolder.SetFont(self.smallerNFontObj)

		self.showThisWindowOnStart = wx.CheckBox(self, label="Always show this window on Start", pos=(20, 170), size=(350, 30))
		self.showThisWindowOnStart.SetFont(self.smallerNFontObj)
		self.showThisWindowOnStart.SetValue(True)

	def newFile(self, event):
		pass

	def openFolder(self, event):
		pass

class WelcomeFrame(wx.Frame):
	def __init__(self, parent, title):
		super(WelcomeFrame, self).__init__(parent, title=title, size=(400, 250))

		self.panel = WelcomePanel(self)

class WelcomePage(wx.App):
	def OnInit(self):
		self.frame = WelcomeFrame(parent=None, title="Welcome - StoryTypewriter")
		self.frame.Show()

		return True