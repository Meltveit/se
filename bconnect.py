import os
import argparse
import datetime
from pathlib import Path

def print_file_content(file_path, output, indent=""):
    """
    Skriver ut innholdet i en enkeltstående fil med linjenummerering.
    
    Args:
        file_path (str): Stien til filen
        output (list): Listen hvor outputtet skal lagres
        indent (str): Innrykk for formatering
    """
    def write_line(text=""):
        output.append(text)
        print(text)
    
    try:
        if not os.path.exists(file_path):
            write_line(f"{indent}FEIL: Filen '{file_path}' finnes ikke.")
            return
        
        # Sjekk om filen er binær
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                f.read(1024)
            is_binary = False
        except UnicodeDecodeError:
            is_binary = True
        
        if is_binary:
            write_line(f"{indent}📄 {os.path.basename(file_path)} (BINÆR FIL)")
            return
        
        write_line(f"{indent}📄 {os.path.basename(file_path)}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        content_indent = indent + "    "
        write_line(f"{indent}├── FILINNHOLD ({len(lines)} linjer):")
        
        for i, line in enumerate(lines, 1):
            line = line.rstrip('\r\n')
            line_num = f"{i:4d} │ "
            write_line(f"{content_indent}{line_num}{line}")
        
        write_line(f"{indent}└── SLUTT PÅ FIL")
        write_line()
    except Exception as e:
        write_line(f"{indent}├── FEIL VED LESING AV FIL: {str(e)}")
        write_line()

def print_directory_structure(start_path, exclude_dirs=None, exclude_extensions=None, output=None):
    """
    Skriver ut mappestrukturen og innholdet i kodefilene med linjenummerering.
    
    Args:
        start_path (str): Rotmappen som skal utforskes
        exclude_dirs (list): Mapper som skal ekskluderes
        exclude_extensions (list): Filtyper som skal ekskluderes
        output (list): Listen hvor outputtet skal lagres
    """
    if exclude_dirs is None:
        exclude_dirs = ['.git', 'node_modules', 'venv', '__pycache__', '.idea', '.vscode']
    
    if exclude_extensions is None:
        exclude_extensions = ['.pyc', '.pyo', '.pyd', '.dll', '.exe', '.obj', '.o', '.a', '.lib', '.so', '.dylib', 
                             '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg', '.mp3', '.mp4', '.avi', '.mov',
                             '.zip', '.tar', '.gz', '.rar', '.7z']
    
    def write_line(text=""):
        output.append(text)
        print(text)
    
    def is_binary_file(file_path):
        """Sjekker om en fil er binær."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                f.read(1024)
            return False
        except UnicodeDecodeError:
            return True
    
    # Skriv ut tittel for mappen
    write_line(f"MAPPESTRUKTUR OG KODEINNHOLD FOR: {os.path.abspath(start_path)}")
    write_line("=" * 80)
    write_line()
    
    for root, dirs, files in os.walk(start_path):
        # Filtrer ut ekskluderte mapper
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        # Beregn nivå for innrykk
        rel_path = os.path.relpath(root, start_path)
        level = 0 if rel_path == '.' else rel_path.count(os.sep) + 1
        indent = '│   ' * level
        
        # Skriv ut mappenavnet
        folder_name = os.path.basename(root) if root != start_path else os.path.basename(start_path)
        write_line(f"{indent}📁 {folder_name}/")
        
        # Sorter filer alfabetisk
        files.sort()
        
        for file in files:
            file_path = os.path.join(root, file)
            extension = os.path.splitext(file)[1]
            
            # Hopp over ekskluderte filtyper
            if extension in exclude_extensions:
                continue
            
            file_indent = '│   ' * (level + 1)
            
            # Sjekk om filen er binær
            if is_binary_file(file_path):
                write_line(f"{file_indent}📄 {file} (BINÆR FIL)")
                continue
            
            write_line(f"{file_indent}📄 {file}")
            
            # Les og vis filinnholdet med linjenummerering
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                content_indent = '│   ' * (level + 2)
                write_line(f"{file_indent}├── FILINNHOLD ({len(lines)} linjer):")
                
                for i, line in enumerate(lines, 1):
                    line = line.rstrip('\r\n')
                    line_num = f"{i:4d} │ "
                    write_line(f"{content_indent}{line_num}{line}")
                
                write_line(f"{file_indent}└── SLUTT PÅ FIL")
                write_line()
            except Exception as e:
                write_line(f"{file_indent}├── FEIL VED LESING AV FIL: {str(e)}")
                write_line()

def main():
    parser = argparse.ArgumentParser(description='Genererer en detaljert oversikt over mappestruktur og kodeinnhold')
    parser.add_argument('-o', '--output', help='Filnavn for å lagre resultatet (valgfritt, genereres automatisk hvis ikke angitt)')
    parser.add_argument('-e', '--exclude-dirs', nargs='+', help='Mapper som skal ekskluderes')
    parser.add_argument('-x', '--exclude-extensions', nargs='+', help='Filendelser som skal ekskluderes')
    
    args = parser.parse_args()
    
    # Lag en liste for å samle output
    output = []
    
    # Skriv ut tittel og tidsstempel
    def write_line(text=""):
        output.append(text)
        print(text)
    
    write_line(f"PROSJEKTSTRUKTUR OG KODEINNHOLD")
    write_line(f"Generert: {datetime.datetime.now().strftime('%d.%m.%Y kl. %H:%M:%S')}")
    write_line("=" * 80)
    write_line()
    
    # Analyser mappestruktur
    src_path = r"C:\bconnect\se\b2b-sosial\src"
    print(f"Analyserer mappestruktur fra: {os.path.abspath(src_path)}")
    print_directory_structure(
        src_path, 
        exclude_dirs=args.exclude_dirs,
        exclude_extensions=args.exclude_extensions,
        output=output
    )
    
    # Legg til skillelinje mellom mappeskanningen og individuelle filer
    write_line("\n" + "=" * 80 + "\n")
    write_line("INDIVIDUELLE FILER:")
    write_line()
    
    # Analyser package.json
    package_json_path = r"C:\bconnect\se\b2b-sosial\package.json"
    write_line(f"ANALYSE AV: {os.path.abspath(package_json_path)}")
    write_line("-" * 80)
    print_file_content(package_json_path, output)
    
    # Analyser index.html
    index_html_path = r"C:\bconnect\se\b2b-sosial\public\index.html"
    write_line(f"ANALYSE AV: {os.path.abspath(index_html_path)}")
    write_line("-" * 80)
    print_file_content(index_html_path, output)
    
    # Bestem utdatafil
    if args.output:
        output_file = args.output
    else:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"b2b_sosial_prosjektstruktur_{timestamp}.txt"
    
    # Skriv til fil
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))
    write_line(f"\nResultatet er lagret i '{os.path.abspath(output_file)}'")

if __name__ == "__main__":
    main()