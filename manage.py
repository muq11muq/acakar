#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # Ensure project root is on sys.path so imports work in build environments
    project_root = os.path.dirname(os.path.abspath(__file__))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    # Debugging: print environment info to build logs if import fails (use stderr & flush)
    try:
        sys.stderr.write(f"[manage.py] PROJECT_ROOT: {project_root}\n")
        sys.stderr.write(f"[manage.py] CWD: {os.getcwd()}\n")
        sys.stderr.write(f"[manage.py] ROOT_LISTING: {sorted(os.listdir(project_root))}\n")
        sys.stderr.flush()

        # If dalal_project is not directly importable, search upward for it
        if not os.path.isdir(os.path.join(project_root, 'dalal_project')):
            cur = project_root
            found = None
            for _ in range(6):
                parent = os.path.dirname(cur)
                if parent == cur:
                    break
                if os.path.isdir(os.path.join(parent, 'dalal_project')):
                    found = parent
                    break
                cur = parent
            if found:
                if found not in sys.path:
                    sys.path.insert(0, found)
                sys.stderr.write(f"[manage.py] Found dalal_project in parent: {found}\n")
                sys.stderr.flush()

        import importlib
        try:
            importlib.import_module('dalal_project')
            sys.stderr.write("[manage.py] dalal_project import: OK\n")
            sys.stderr.flush()
        except Exception as _e:
            sys.stderr.write(f"[manage.py] dalal_project import error: {repr(_e)}\n")
            sys.stderr.flush()
    except Exception as _exc:
        try:
            sys.stderr.write(f"[manage.py] debug print failed: {repr(_exc)}\n")
            sys.stderr.flush()
        except Exception:
            pass

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dalal_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
