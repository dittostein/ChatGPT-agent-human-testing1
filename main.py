# ngrok http --domain=buffalo-summary-hagfish.ngrok-free.app
from flask import Flask, send_from_directory, abort
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"

app = Flask(__name__, static_folder=None)


@app.get("/")
def index():
    return send_from_directory(PUBLIC_DIR, "index.html")


@app.get("/<path:resource>")
def static_or_spa(resource: str):
    target = PUBLIC_DIR / resource
    if target.exists() and target.is_file():
        return send_from_directory(PUBLIC_DIR, resource)
    if resource.endswith("/"):
        # Prevent directory traversal while still allowing trailing slashes.
        abort(404)
    return send_from_directory(PUBLIC_DIR, "index.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=False)
