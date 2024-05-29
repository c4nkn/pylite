from graphviz import Digraph

pseudocode = """FUNCTION factorial(x):

    IF x EQUALS 1:
        RETURN 1
    ELSE:
        RETURN (x * factorial(x-1))

SET num TO 3
PRINT "The factorial of", num, "is", factorial(num)
"""

def parse_pseudocode(pseudocode):
    lines = pseudocode.strip().split('\n')
    structure = {
        'classes': {},
        'functions': [],
        'main': []
    }
    current_class = None
    current_func = None

    for line in lines:
        line = line.strip()
        if line.startswith('CLASS'):
            class_name = line.split()[1][:-1]
            structure['classes'][class_name] = []
            current_class = class_name
        elif line.startswith('FUNCTION'):
            func_name = line.split()[1].split('(')[0]
            if current_class:
                structure['classes'][current_class].append(func_name)
            else:
                structure['functions'].append(func_name)
            current_func = func_name
        elif line.startswith('IF __name__'):
            current_class = None
            current_func = None
        elif line.startswith('PRINT') or line.startswith('SET') or line.startswith('FOR') or line.startswith('IF'):
            if not current_class and not current_func:
                structure['main'].append(line)
    
    return structure

def generate_structure_chart(structure):
    dot = Digraph(comment='Structure Chart')

    for class_name, methods in structure['classes'].items():
        dot.node(class_name, class_name, shape='box')
        for method in methods:
            dot.node(method, method)
            dot.edge(class_name, method)

    for func in structure['functions']:
        dot.node(func, func)

    if structure['main']:
        dot.node('main', 'Main Program', shape='ellipse')
        for line in structure['main']:
            if 'PRINT' in line:
                dot.node(line, line)
                dot.edge('main', line)
            elif 'SET' in line:
                var_name = line.split()[1]
                dot.node(var_name, var_name)
                dot.edge('main', var_name)
            elif 'FOR' in line:
                loop_var = line.split()[1]
                dot.node(loop_var, loop_var)
                dot.edge('main', loop_var)
            elif 'IF' in line:
                condition = line.split()[1]
                dot.node(condition, condition)
                dot.edge('main', condition)
    
    return dot

structure = parse_pseudocode(pseudocode)
chart = generate_structure_chart(structure)
chart.render('structure_chart', format='png', cleanup=True)
