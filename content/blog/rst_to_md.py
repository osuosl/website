import os, os.path, re

def convert_rst_to_hugo(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as rst_file:
        rst_content = rst_file.read()

    # fix links:
    ref_definitions = re.findall(r'^\.\. _(.+?):\s+(.+)$', rst_content, flags=re.MULTILINE)

    for label, url in ref_definitions:
        inline_ref = '`{}`_'.format(label)
        markdown_link = '[{}]({})'.format(label, url)
        rst_content = rst_content.replace(inline_ref, markdown_link)

    rst_content = re.sub(r'^\.\. _(.+?):\s+(.+)$', '', rst_content, flags=re.MULTILINE)

    with open(output_file, 'w', encoding='utf-8') as md_file:
        md_file.write(rst_content)

if __name__ == '__main__':
    files = os.listdir('.')

    for file in files:
        filename, extension = os.path.splitext(file)

        if extension in ('.rst'):
            input_file = file
            output_file = filename + '.md'

            convert_rst_to_hugo(input_file, output_file)

            print(f'Conversion complete. Output saved to {output_file}')
