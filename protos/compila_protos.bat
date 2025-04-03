# Gera os arquivos .d.ts
protoc --plugin=protoc-gen-ts=".\\node_modules\\.bin\\protoc-gen-ts.cmd" --ts_out=grpc_js:..\protos -I . ./*.proto

# Gera os arquivos js
npx grpc_tools_node_protoc -I ../../protos --js_out=import_style=commonjs,binary:./protos --grpc_out=grpc_js:./protos ../../protos/*.proto

..\..\.venv\Scripts\python.exe -m grpc_tools.protoc --plugin=protoc-gen-ts="..\\..\\frontend-next\\node_modules\\.bin\\protoc-gen-ts.cmd" --ts_out=grpc_js:"..\\..\\frontend\\frontend-next\\protos" -I ../../protos ../../protos/*.proto
