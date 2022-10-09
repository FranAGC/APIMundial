
outer.get('/:id', function (req, res) {
    const {id} = req.params;
    sql.query(`SELECT * FROM tb_estadios WHERE id_estadio = ?`, id, function(err, rows, fields)   
    {
        if (err) throw err;  
        if(id <= 8 && id > 0) {
            res.status(200).json(rows); 
            
        } else {
            res.status(404).json({
                message: "not found"
            });
        }
    });
  });





  //INSERTS
  
router.post('/', (req, res) => {
    const body = req.body;
    conexion.query('INSERT INTO tb_estadios SET ?', body, function (error, results, fields) {
    if (error) throw error;
    });
    
    res.status(201).send(body);
});



router.patch('/:id', (req, res) => {
    const {id} = req.params;
    const body = req.body;
    conexion.query(`UPDATE tb_estadios SET foto_estadio = ? 
    WHERE id_estadio = ?`, [body.foto_estadio, id], function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(body);
});




router.delete('/:id', (req, res) => {
    const {id} = req.params;
    conexion.query(`DELETE FROM tb_estadios 
    WHERE id_estadio = ?`, id, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(`Registro: ${id} borrado`);
});





