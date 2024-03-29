module.exports = function(app) {

    const UserController = require("../controllers/UserController");

    app.post('/createNote',UserController.createNote);
    app.delete('/deleteNote/:noteId',UserController.deleteNote);
    app.get('/getOneNote/:noteId',UserController.getOneNote);
    app.put('/updateNote/:noteId',UserController.updateNote);

    app.get('/getAllNote',UserController.getAllNote);
    app.get('/getSearchNote',UserController.getSearchNote);
    app.put('/handleFavorite/:noteId',UserController.handleFavorite);
    
};