import os

def list_files(startpath, exclude_dirs, output_file):
    with open(output_file, 'w') as f:
        for root, dirs, files in os.walk(startpath):
            # Skip the directories in exclude_dirs
            dirs[:] = [d for d in dirs if os.path.join(root, d) not in exclude_dirs]
            level = root.replace(startpath, '').count(os.sep)
            indent = ' ' * 4 * level
            line = f'{indent}{os.path.basename(root)}/'
            print(line)
            f.write(line + '\n')
            subindent = ' ' * 4 * (level + 1)
            for file in files:
                line = f'{subindent}{file}'
                print(line)
                f.write(line + '\n')

if __name__ == "__main__":
    path = '/Users/sandroamaglobeli/Documents/GitHub/WowPantry/pantry-tracker'
    exclude_dirs = [
        os.path.join(path, '.next'),
        os.path.join(path, 'node_modules')
    ]
    output_file = 'file_structure.txt'
    print(f"Listing files in directory: {path}, excluding {exclude_dirs}\n")
    list_files(path, exclude_dirs, output_file)
    print(f"\nFile structure saved to {output_file}")
