protoc --plugin=protoc-gen-ts=.\\node_modules\\.bin\\protoc-gen-ts.cmd --ts_out=grpc_js: \\frontend\\frontend-next\\protos --proto_path=./protos -I . .\\protos\\*.proto
cd ..
cd ./frontend/frontend-next
grpc_tools_node_protoc -I ./protos --js_out=import_style=commonjs,binary:./frontend/frontend-next/protos --grpc_out=grpc_js:./frontend/frontend-next/protos ./protos/*.proto