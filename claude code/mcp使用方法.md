---
date created: 2026-08-Sa 11:52:55
date modified: 2026-08-Sa 11:56:09
---


https://github.com/danielsimonjr/everything-mcp


## Global Installation

[](https://github.com/danielsimonjr/everything-mcp#global-installation)

```shell
npm install -g @danielsimonjr/everything-mcp

## mcp
{
  "mcpServers": {
    "everything": {
      "command": "everything-mcp"
    }
  }
}

```


### VS Code

[](https://github.com/danielsimonjr/everything-mcp#vs-code)

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "everything": {
      "command": "npx",
      "args": ["-y", "@danielsimonjr/everything-mcp"]
    }
  }
}
```