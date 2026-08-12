def main():
    """Console entry point used by pyproject scripts: start -> app.run:main
    Runs the uvicorn server when the package is installed and `start` is invoked.
    """
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
