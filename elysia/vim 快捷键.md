---
date created: 2025-12-五 11:15:44
date modified: 2025-12-五 11:18:21
---

1.vscode

```json
//vscode  设置

 "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  "vim.insertModeKeyBindings": [
    {
      "before": [
        "j",
        "j"
      ],
      "after": [
        "<Esc>"
      ]
    }
  ],
  "vim.visualModeKeyBindings": [
    {
      "before": [
        "H"
      ],
      "after": [
        "^"
      ]
    },
    {
      "before": [
        "L"
      ],
      "after": [
        "$"
      ]
    }
  ],
  "vim.normalModeKeyBindings": [
    {
      "before": [
        "H"
      ],
      "after": [
        "^"
      ]
    },
    {
      "before": [
        "L"
      ],
      "after": [
        "$"
      ]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": [
        "<leader>",
        "d"
      ],
      "after": [
        "d",
        "d"
      ]
    },
    {
      "before": [
        "<C-n>"
      ],
      "commands": [
        ":nohl"
      ]
    },
    {
      "before": [
        "K"
      ],
      "commands": [
        "lineBreakInsert"
      ],
      "silent": true
    },
    {
      "before": [
        "<C-s>"
      ],
      "commands": [
        ":w"
      ]
    },
    {
      "before": [
        "<leader>",
        "n",
        "d"
      ],
      "commands": [
        "explorer.newFolder"
      ]
    },
    {
      "before": [
        "<leader>",
        "n",
        "f"
      ],
      "commands": [
        "explorer.newFile"
      ]
    },
    {
      "key": "r",
      "command": "renameFile",
      "when": "filesExplorerFocus && foldersViewVisible && !explorerResourceIsRoot && !explorerResourceReadonly && !inputFocus"
    },
    {
      "key": "d",
      "command": "deleteFile",
      "when": "filesExplorerFocus && foldersViewVisible && !explorerResourceMoveableToTrash && !inputFocus"
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-c>": false,
    "<C-f>": false,
    "<C-k>": false,
    "<C-p>": false,
    "<C-j>": false,
    "<C-x>": false
  },





```


```json
//vscode  keymap
// 将键绑定放在此文件中以覆盖默认值auto[]
[
	{
		"key": "ctrl+u",
		"command": "clineChinese.addToChat",
		"when": "editorHasSelection"
	},
	{
		"key": "alt+q",
		"command": "editor.action.triggerSuggest",
		"when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly && !suggestWidgetVisible"
	},
	{
		"key": "ctrl+;",
		"command": "workbench.view.explorer",
		"when": "viewContainer.workbench.view.explorer.enabled"
	},
	{
		"key": "ctrl+'",
		"command": "workbench.action.focusFirstEditorGroup"
	},
	{
		"key": "ctrl+i",
		"command": "-editor.action.triggerSuggest",
		"when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly && !suggestWidgetVisible"
	},
	{
		"key": "ctrl+shift+oem_2",
		"command": "editor.action.quickFix",
		"when": "editorHasCodeActionsProvider && textInputFocus && !editorReadonly"
	},
	{
		"key": "ctrl+oem_period",
		"command": "-editor.action.quickFix",
		"when": "editorHasCodeActionsProvider && textInputFocus && !editorReadonly"
	},
	{
		"key":"a", 
		"command": "explorer.newFile",
		"when": "filesExplorerFocus && !inputFocus"
	},
	{
		"key": "shift+a",
		"command": "explorer.newFolder",
		"when": "filesExplorerFocus && !inputFocus"
	}
]


```



2.zod 

```json

//zod


```