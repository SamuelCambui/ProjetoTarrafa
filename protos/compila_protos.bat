protoc --plugin=protoc-gen-ts=.\\node_modules\\.bin\\protoc-gen-ts.cmd --ts_out=grpc_js:.\\frontend\\frontend-next\\protos --proto_path=./protos -I . .\\protos\\*.proto

npx grpc_tools_node_protoc -I ../../protos --js_out=import_style=commonjs:./protos --grpc_out=grpc_js:./protos ../../protos/*.proto