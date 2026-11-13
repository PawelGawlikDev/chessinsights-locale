# ChessInsights.ai extension translations

Community translations for the [ChessInsights.ai](https://chess-insights.app)
browser extension. This repository contains translations and contribution tooling
only, not the extension source code or website translations.

## Contribute

1. Fork this repository and create a branch.
2. Edit `pl.json` to improve Polish, or copy `en.json` to a new browser-supported
   locale filename, such as `de.json` or `pt_BR.json`.
3. Translate each `message` value. Keep the message keys unchanged.
4. Run `node scripts/validate.mjs` (Node.js 24 or newer).
5. Open a pull request describing the language and changes.

English (`en.json`) is the source of truth. Each locale must have the same keys.
Keep placeholders such as `$1` and `$NAME$`, any placeholder definitions, URLs,
and markup intact. Do not translate product names such as ChessInsights.ai,
Lichess, or Chess.com. Prefer clear, concise wording that fits buttons and menus.

Example:

```json
{
  "analyze": {
    "message": "Analyze"
  }
}
```

You can edit files directly on GitHub; the validation workflow checks pull
requests without needing access to the extension's private repository.
Only maintainers should add, remove, or rename source keys to match app changes.

## Releases and integration

The extension consumes a pinned commit of this repository as a Git submodule.
Merged translations appear in a future extension release after maintainers
update that pin; they are not downloaded at runtime.

## License

MIT — see [LICENSE](LICENSE). Contributions are provided under the same license.
This license covers this repository only, not the extension or its other assets.
