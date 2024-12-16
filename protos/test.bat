protoc ^
  --plugin=protoc-gen-ts=".\\node_modules\\.bin\\protoc-gen-ts.cmd" ^
  --ts_out=grpc_js:./protos ^
  --js_out=import_style=commonjs,binary:./protos ^
  --grpc_out=grpc_js:./protos ^
  -I ./protos ^
  ./protos/*.proto