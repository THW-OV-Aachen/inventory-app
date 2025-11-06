import os

def print_structure(startpath, indent=0):
    """Recursively prints the directory structure."""
    for item in sorted(os.listdir(startpath)):
        path = os.path.join(startpath, item)
        if os.path.isdir(path):
            print("│   " * indent + "├── 📁 " + item)
            print_structure(path, indent + 1)
        else:
            print("│   " * indent + "├── 📄 " + item)

if __name__ == "__main__":
    project_path = "/Users/imane/Desktop/Semester lll/Lab Work/nventory-app"
    print(f"Project structure for: {os.path.abspath(project_path)}\n")
    print_structure(project_path)
