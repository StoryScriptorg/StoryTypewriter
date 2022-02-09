from UIParts.data import *

if configObj["showWelcomeWindow"]:
	from UIParts.projmgr import WelcomePage
	welcomepage = WelcomePage()
	welcomepage.MainLoop()
else:
	from UIParts.editor import EditorApplication
	editor = EditorApplication()
	editor.MainLoop()
