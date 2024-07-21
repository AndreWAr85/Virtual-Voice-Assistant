const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Путь к главному файлу JavaScript
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  mode: 'development', // Установи режим разработки
  module: {
    rules: [
      {
        test: /\.css$/, // Обработка файлов CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // Обработка изображений
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Очистка папки dist перед сборкой
    new HtmlWebpackPlugin({
      title: 'Virtual Voice Assistant',
      template: 'src/index.html', // Шаблон HTML
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Замена contentBase на static
    compress: true,
    port: 9000, // Установи порт 9000
    open: true, // Открытие браузера при запуске
    hot: true, // Включение HMR (Hot Module Replacement)
  },
};
