import re
import sys

conversion_rules = {
    "import": "IMPORT",
    "if": "IF",
    "else:": "ELSE:",
    "elif": "ELSEIF",
    "for": "FOR",
    "=": "TO",
    "==": "EQUALS",
    "while": "WHILE",
    "until": "UNTIL",
    "class": "CLASS",
    "def": "FUNCTION",
    "except:": "EXCEPT:",
    "try:": "TRY:",
    "pass": "PASS",
    "in": "IN",
    "and": "AND",
    "or": "OR",
    "not": "NOT",
    "is": "IS",
    "True": "TRUE",
    "False": "FALSE",
    "None": "NONE"
}

prefix_conversion_rules = {
    "=": "SET ", 
}

privileged_conversion_rules = {
    "return": "RETURN", 
    "input": "INPUT"
}

def l2pseudo(to_pseudo):
    for line_index, line in enumerate(to_pseudo):
        line = str(line)
        indent = re.match(r'\s*', line).group()

        if line.strip().startswith("print"):
            to_pseudo[line_index] = indent + convert_print_statement(line)
            continue
        
        line = re.split(r'(\s+)', line)
        
        for key, value in prefix_conversion_rules.items():
            if key in line:
                if not str(line[0]) == '':
                    line[0] = value + line[0]
                else:
                    line[2] = value + line[2]
        
        for key, value in conversion_rules.items():
            for word in line:
                if key == str(word):
                    line[line.index(word)] = value
        
        for key, value in privileged_conversion_rules.items():
            for word in line:
                line[line.index(word)] = word.replace(key, value)
        
        for key, value in prefix_conversion_rules.items():
            for word in line:
                if word == key:
                    del line[line.index(word)]
        
        to_pseudo[line_index] = "".join(line)
    return to_pseudo

def convert_print_statement(line):
    content = line.strip()[6:-1]

    if content.startswith('f'):
        content = content[1:].strip('"\'')

    pseudo_print = 'PRINT ' + re.sub(r'{(.+?)}', r'"\1"', content)
    return pseudo_print.strip()

def convert_python_code_to_pseudo(code_string):
    file_lines = code_string.split('\n')
    work_file = l2pseudo(file_lines)
    return "\n".join(work_file)

if __name__ == "__main__":
    python_code = """def factorial(x):

    if x == 1:
        return 1
    else:
        return (x * factorial(x-1))

num = 3
print("The factorial of", num, "is", factorial(num))"""
    # python_code = sys.argv[1]
    pseudo_code = convert_python_code_to_pseudo(python_code)
    print(pseudo_code)