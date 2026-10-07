import sys, pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
html = (raiz / "index.html").read_text(encoding="utf-8")
css = (raiz / "css/style.css").read_text(encoding="utf-8")
js = (raiz / "js/game.js").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="css/style.css">', "<style>\n" + css + "</style>")
html = html.replace('<script src="js/game.js"></script>', "<script>\n" + js + "</script>")
saida = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else raiz / "pong-single.html"
saida.write_text(html, encoding="utf-8")
print("gerado:", saida, f"({saida.stat().st_size/1024:.1f} KB)")
