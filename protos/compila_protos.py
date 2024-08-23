import os
from grpc_tools import protoc

def compile_protos(proto_dir, proto_out):
    for root, _, files in os.walk(proto_dir):
        for file in files:
            if file.endswith('.proto'):
                proto_path = os.path.join(root, file)
                protoc.main((
                    '',
                    '-I{}'.format(proto_dir),
                    '--python_out={}'.format(proto_out),
                    '--grpc_python_out={}'.format(proto_out),
                    '--pyi_out={}'.format(proto_out),
                    proto_path,
                ))

def fix_imports(proto_dir):
    for root, _, files in os.walk(proto_dir):
        for file in files:
            if file.endswith('.py'):
                fix_imports_in_file(os.path.join(root, file))

def fix_imports_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Substituir 'import messages_pb2 as messages__pb2' por 'from . import messages_pb2 as messages__pb2'
    new_content = content.replace('import messages_pb2 as messages__pb2', 'from . import messages_pb2 as messages__pb2')
    
    with open(file_path, 'w') as file:
        file.write(new_content)

if __name__ == '__main__':
    diretorio_entrada = '.'  # Diretório onde estão os arquivos .proto
    diretorio_saida = 'out'
    compile_protos(diretorio_entrada, diretorio_saida)
    fix_imports(diretorio_saida)