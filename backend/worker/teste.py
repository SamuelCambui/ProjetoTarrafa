import os

# Diretório base onde os módulos de tasks estão localizados
BASE_PATH_PPG = "backend/worker/tasks_ppg"
BASE_IMPORT_PATH_PPG = "backend.worker.tasks_ppg"
BASE_PATH_PPGLS = "backend/worker/tasks_ppgls"
BASE_IMPORT_PATH_PPGLS = "backend.worker.tasks_ppgls"
BASE_PATH_GRAD = "backend/worker/tasks_grad"
BASE_IMPORT_PATH_GRAD = "backend.worker.tasks_grad"

# Encontra todos os arquivos Python no diretório BASE_PATH
def list_task_modules(base_path, base_import_path):
    task_modules = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.endswith(".py") and file != "__init__.py":
                # Converte o caminho do arquivo para o formato de importação
                relative_path = os.path.relpath(os.path.join(root, file), base_path)
                module_name = relative_path.replace(os.sep, ".").removesuffix(".py")
                full_import_path = f"{base_import_path}.{module_name}"
                task_modules.append(full_import_path)
    return task_modules

# Lista automaticamente todos os módulos de tasks
task_modules = list_task_modules(BASE_PATH_PPG, BASE_IMPORT_PATH_PPG)
task_modules.extend(list_task_modules(BASE_PATH_PPGLS, BASE_IMPORT_PATH_PPGLS))
task_modules.extend(list_task_modules(BASE_PATH_GRAD, BASE_IMPORT_PATH_GRAD))

# Configura o Celery com os módulos encontrados

# Debug para verificar os módulos encontrados
print("Tasks carregadas:", task_modules)