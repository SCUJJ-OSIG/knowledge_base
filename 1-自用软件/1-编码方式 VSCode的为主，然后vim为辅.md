---
date created: '2026-04-三 13:09:20'
date modified: '2026-04-三 13:25:18'
tags:
  - 自用软件
series: 自用软件
---

[[Vim 常用操作速查手册]]


## vscode
### vscode 设置

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
### vscode keymap

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




## zed

```json
[
  {
    // 当你处于 Vim 的 非输入模式（即 Normal 模式、Visual 模式、Motion 模式等），且当前没有打开下拉菜单（如指令面板或补全菜单）时
    "context": "VimControl && !menu",
    "bindings": {
      // Put key bindings here if you want them to work in normal & visual mode.
    },
  },
  // 专门针对 Vim 的 Normal（普通）模式。
  {
    "context": "vim_mode == normal && !menu",
    "bindings": {
      // "shift-y": ["workspace::SendKeystrokes", "y $"] // Use neovim's yank behavior: yank to end of line.
    },
  },
  {
    "context": "vim_mode == insert",
    "bindings": {
      "j j": "vim::NormalBefore", // In insert mode, make jk escape to normal mode.
    },
  },
  // 当你没打开任何文件（空白面板），或者正在进行屏幕共享时
  {
    "context": "EmptyPane || SharedScreen",
    "bindings": {
      // Put key bindings here (in addition to the context above) if you want them to
      // work when no editor exists.
      // "space f": "file_finder::Toggle"
    },
  },

  // {
  //   "context": "ProjectPanel",
  //   "bindings": {
  //     // 当光标在左侧资源管理器时，按下 a 创建新文件
  //     "a": "project_panel::NewFile",
  //     // 按下 r 进行重命名
  //     "r": "project_panel::Rename",
  //     // 其他常用资源管理器快捷键建议：
  //     "d": "project_panel::Delete",
  //     "shift-a": "project_panel::NewDirectory",
  //     "enter": "project_panel::OpenPermanent",
  //   },
  // },

  {
    "context": "Editor && !menu",
    "bindings": {
      "ctrl-c": "editor::Copy", // vim default: return to normal mode
      "ctrl-x": "editor::Cut", // vim default: decrement
      "ctrl-v": "editor::Paste", // vim default: visual block mode
      "ctrl-y": "editor::Undo", // vim default: line up
      "ctrl-f": "buffer_search::Deploy", // vim default: page down
      "ctrl-o": "workspace::Open", // vim default: go back
      "ctrl-s": "workspace::Save", // vim default: show signature
      "ctrl-a": "editor::SelectAll", // vim default: increment
      "ctrl-b": "workspace::ToggleLeftDock", // vim default: down
    },
  },

  {
    "context": "vim_mode == insert",
    "bindings": {
      "ctrl-x ctrl-o": "editor::ShowCompletions",
      "ctrl-x ctrl-a": "assistant::InlineAssist", // zed specific
      // For showing edit prediction manually.
      "ctrl-x ctrl-c": "editor::ShowEditPrediction", // zed specific
    },
  },
  {
    "context": "ProjectPanel && not_editing",
    "bindings": {
      "s h": "workspace::ActivatePaneLeft",
    },
  },
  {
    "context": "Workspace",
    "use_key_equivalents": true,
    "bindings": {
      "ctrl-w i": "terminal_panel::ToggleFocus",
      "ctrl-w p": "agent::ToggleFocus",
      "ctrl-w o": "project_panel::ToggleFocus",
    },
  },
  {
    // I had to add this here because it seems like setting them to null doesn't
    // really does anything. Duplicating the workspace panel focus works.
    "context": "(VimControl || (!Editor && !Terminal))",
    "use_key_equivalents": true,
    "bindings": {
      "ctrl-w i": "terminal_panel::ToggleFocus",
      "ctrl-w p": "agent::ToggleFocus",
      "ctrl-w o": "project_panel::ToggleFocus",
    },
  },
  {
    "context": "VimControl && !menu",
    "bindings": {
      "g s": "outline::Toggle",
      "g i": "editor::ToggleCodeActions",
      "g d": "editor::GoToDefinition",
      "g b": "pane::GoToOlderTag",
      "g c": ["editor::ToggleComments", { "advance_downwards": false }],
    },
  },
  {
    "context": "Editor && VimControl && !VimWaiting && !menu",
    "bindings": {
      "g l": "vim::SelectNext",
      "g L": "vim::SelectPrevious",
      "g a": "editor::SelectAllMatches",
      "g shift-a": "editor::FindAllReferences",
      "g f": "project_symbols::Toggle",
      "space p e": "diagnostics::Deploy", // Zed specific
    },
  },
  {
    "context": "Editor && (vim_mode == normal || vim_mode == visual) && !VimWaiting && !menu",
    "bindings": {
      // Key-bindings for normal & visual mode

      // Open markdown preview
      "space m p": "markdown::OpenPreview",
      "space m P": "markdown::OpenPreviewToTheSide",
      // Git
      "space g h d": "editor::ToggleSelectedDiffHunks",
      "space g h r": "git::Restore",
    },
  },
  {
    "context": "Editor && vim_mode == normal && !VimWaiting && !menu",
    "bindings": {
      // Key-bindings to work only in normal mode
      "space e": "editor::Hover",

      // Buffers
      "s v": "pane::SplitRight",
      "s s": "pane::SplitDown",
      "s l": "workspace::ActivatePaneRight",
      "s h": "workspace::ActivatePaneLeft",
      "s k": "workspace::ActivatePaneUp",
      "s j": "workspace::ActivatePaneDown",
      "space h": "pane::ActivatePreviousItem",
      "space l": "pane::ActivateNextItem",
      "space c": "pane::CloseActiveItem",
      "space p f": "file_finder::Toggle",
      "space p s": "pane::DeploySearch",
      "space p t": "tab_switcher::Toggle",
      "space f": "editor::Format",
      "ctrl-w l": "workspace::ToggleRightDock",
      "ctrl-w h": "workspace::ToggleLeftDock",
      "ctrl-w j": "workspace::ToggleBottomDock",
      "ctrl-w t": "pane::TogglePinTab",

      // Error navigation【】
      "[ e": "editor::GoToDiagnostic",
      "] e": "editor::GoToPreviousDiagnostic",

      // Git
      "[ g": "editor::GoToHunk",
      "] g": "editor::GoToPreviousHunk",
    },
  },
  {
    "context": "Terminal",
    "use_key_equivalents": true,
    "bindings": {
      // Key-bindings for being in terminal
      "ctrl-w k": "terminal_panel::ToggleFocus",
    },
  },
  {
    "context": "EmptyPane || SharedScreen",
    "bindings": {
      // Key-bindings for empty pane
      "space p f": "file_finder::Toggle",
      "space f p": "projects::OpenRecent",
      "ctrl-w l": "workspace::ToggleRightDock",
    },
  },
  {
    "context": "Editor && vim_mode == visual && !VimWaiting && !menu",
    "bindings": {
      // visual, visual line & visual block modes
      "g c": "editor::ToggleComments",
    },
  },
  {
    "context": "Editor && vim_mode == insert",
    "bindings": {
      "j k": "vim::NormalBefore",
    },
  },
  {
    "context": "Pane",
    "bindings": {
      "ctrl-w w": [
        "pane::CloseActiveItem",
        {
          "close_pinned": false
        }
      ]
    }
  },
  {
    "context": "Pane",
    "unbind": {
      "ctrl-w": [
        "pane::CloseActiveItem",
        {
          "close_pinned": false
        }
      ]
    }
  }
]


```
