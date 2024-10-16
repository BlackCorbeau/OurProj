import path from 'path' // вынесли функцию для создания путей в отдельную дирректорию так как теперь эта функция используеться аж в 4-х файлах

const createPath = (name) => path.resolve('.', 'vievs', `${name}.ejs`)

export {
    createPath
}