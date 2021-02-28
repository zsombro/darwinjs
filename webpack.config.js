module.exports = {
    entry: './src/index.ts',
    output: {
        library: 'Darwin',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader'
            }
        ]
    }
}