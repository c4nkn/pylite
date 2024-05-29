import re
from graphviz import Digraph

def parse_pseudocode(pseudocode):
    functions = re.findall(r'FUNCTION (\w+)\(.*?\):', pseudocode)
    variables = re.findall(r'SET (\w+) TO', pseudocode)
    return functions, variables

def analyze_code(functions, variables, pseudocode):
    processes = functions
    data_stores = variables
    data_flows = []

    for function in functions:
        for var in variables:
            if re.search(rf'{function}\(.*{var}.*\)', pseudocode):
                data_flows.append((var, function))

            if re.search(rf'SET {var} TO {function}\(.*\)', pseudocode):
                data_flows.append((function, var))

    return processes, data_stores, data_flows

def generate_dfd(processes, data_stores, data_flows):
    dot = Digraph()

    dot.attr('node', shape='record')
    
    for i, data_store in enumerate(data_stores):
        dot.node(f'ds{i}', label=f"<f0> D{i + 1}|<f1> {data_store}")

    for i, process in enumerate(processes):
        dot.node(f'p{i}', label=f"{{<f0> {i + 1}.0|<f1> {process}}}", shape='Mrecord')

    for data_flow in data_flows:
        source = data_flow[0]
        target = data_flow[1]

        source_node = None
        target_node = None

        for i, data_store in enumerate(data_stores):
            if source == data_store:
                source_node = f'ds{i}:f0'
            if target == data_store:
                target_node = f'ds{i}:f0'

        for i, process in enumerate(processes):
            if source == process:
                source_node = f'p{i}:f0'
            if target == process:
                target_node = f'p{i}:f0'

        if source_node and target_node:
            dot.edge(source_node, target_node)

    dot.render('dfd', format='png', view=True)

pseudocode = """FUNCTION factorial(x):

    IF x EQUALS 1:
        RETURN 1
    ELSE:
        RETURN (x * factorial(x-1))

SET num TO 3
PRINT "The factorial of", num, "is", factorial(num)
"""

functions, variables = parse_pseudocode(pseudocode)
processes, data_stores, data_flows = analyze_code(functions, variables, pseudocode)
generate_dfd(processes, data_stores, data_flows)
