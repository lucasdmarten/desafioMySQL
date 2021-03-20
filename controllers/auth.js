const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {createTokens} = require("../JWT");
const dotenv = require("dotenv");
dotenv.config({
    path: './.env'
});
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
db.connect( (error) => {
    if(error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...")
    }
});


// AUTENTICAÇÃO
exports.register = (req,res) =>{
    console.log(req.body);
    

    const {email,password,passwordConfirm} = req.body;

    db.query(
        "SELECT email FROM usuarios WHERE email = ?",
        [email],
        async (error, results)=>{
            if(error) {
                console.log(error);
            };
            if (results.length > 0) {
                return res.status(400).json({
                    message: 'That email is already in use'
                })
            } else if(password !== passwordConfirm) {
                return res.status(400).json({
                    message: 'Passwords do not match'
                });
            };
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query(
                "INSERT INTO usuarios SET ?",
                {   
                    email:email,
                    password: hashedPassword
                },
                (error, results)=>{
                    if (error) {
                        console.log(error);
                    } else {
                        return res.status(200).json({
                            message: 'WELCOME:',
                            email:email
                        });
                    }
                });
    })

}
exports.login = async (req,res) =>{
    try {
        const { email, password } = req.body;

        // email==false
        if ( !email || !password ) {
            return res.status(400).json({
                message: 'Please provide an email and password'
            })
        };

        db.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email],
            async (error, results) =>{
                console.log(results);
                if ( !results || !(await bcrypt.compare(password, results[0].password)) ) {
                    res.status(401).json({
                        message: 'Email or Password is incorrect'
                    })
                } else {
                    const id = results[0].id_usuario;
                    const accessToken = createTokens(id);
                    console.log("ID: "+id+"  Token:  "+accessToken)
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }

                    res.cookie('acess-token', accessToken, cookieOptions);
                    res.cookie('acess-token-id', id, cookieOptions);
                    //res.cookie('teste', 'teste', cookieOptions);

                    // or res.status(200).redirect('/?valid=' + token)
                    res.json({
                        message: "Usuario de id:"+id+" está conectado!",
                        id: id,
                        email: email,
                        token: accessToken
                    });
                    


                }
            }
        )


    } catch (error) {
        console.log(error)
    }

    

}

// ADICIONAR NAVERS E PROJETOS
exports.add_naver = (req,res) =>{
    const {firstName, lastName, birthDate, admissionDate, jobRole} = req.body
    const user = req.cookies['acess-token-id']
    console.log(user)
    db.query(
        "INSERT INTO navers SET ?",
        {
            id_naver: user,
            firstName:firstName,
            lastName:lastName,
            birthDate:birthDate,
            admissionDate:admissionDate,
            jobRole:jobRole,
            id_usuario: user
        },
        (error, results) =>{
            if (error) {
                console.log(error);
          
                return res.status(400).json({
                    message: "Usuario já possui um naver vinculado a conta."
                })
            } else {
                //console.log(results);
                return res.json({
                    message: "naver adicionado pelo usuario de id: "+user+".",
                    data: {
                        firstName:firstName,
                        lastName:lastName,
                        birthDate:birthDate,
                        admissionDate:admissionDate,
                        jobRole:jobRole,
                        id_usuario:user
                    }
                })
            }
        }
    )
};
exports.add_projeto = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const {name_projeto } = req.body;

    db.query(
        "SELECT * FROM navers WHERE id_usuario = ?",
        [user],
        (erro, results) =>{
            if (erro) {
                console.log(erro);
            } else if (results.length < 0) {
                console.log(results.length);
                res.status(400).json({
                    message: "Não há resultados na query"
                })
            } else {
                console.log(results)
                const id_naver = results[0].id_naver;
                db.query(
                    "INSERT INTO projetos SET ?",
                    {
                        name_projeto: name_projeto,
                        id_usuario: user
                        
                    },
                    (error, results) =>{
                        if (error) {
                            console.log(error);
                        } else {
                            return res.json({
                                message: "projeto adicionado pelo usuario: "+user+" e naver: "+id_naver+".",
                                id_usuario: user,
                                name_projeto: name_projeto,
                                id_naver: id_naver
                            })
                        }
                    }
                )  
            }
        }
    )    
}

// PESQUISA DE NAVERS
exports.list_navers = (req,res, next) =>{
    const user = req.cookies["acess-token-id"];
    db.query(
        "SELECT * FROM navers WHERE id_usuario = ?",
        [user],
        (error,dataNaver) =>{
            if(error){
                console.log(error);
                res.status(400).json({
                    message: "Não há resultados na query"
                })
            } else {
                console.error("query");
                db.query(
                    "SELECT * FROM projetos WHERE id_usuario = ?",
                    [user],
                    (erro, dataProjetos) =>{
                        if (erro) {
                            console.log(erro);
                        } else if (dataProjetos.length < 0) {
                            console.log(dataProjetos.length);
                            res.status(400).json({
                                message: "Não há resultados na query"
                            })
                        } else {
                            console.log(dataProjetos)
                            res.status(200).json({
                                message: "Lista dos navers criados pelo id: "+user,
                                id_naver:dataNaver[0].id_usuario,
                                id_usuario:dataNaver[0].id_usuario,
                                firstName:dataNaver[0].firstName,
                                lastName:dataNaver[0].lastName,
                                birthDate:dataNaver[0].birthDate,
                                admissionDate:dataNaver[0].admissionDate,
                                jobRole:dataNaver[0].jobRole,
                                projetos: {
                                    message: "Lista de projetos em que o naver: "+user+" participa.",
                                    data: dataProjetos
                                }
                            })
                        }
                    }
                )
            }   
        }
    )
};
exports.list_navers_by_id = (req,res, next) =>{
    const {field} = req.params;
    console.log(field)
    db.query(
        "SELECT * FROM navers WHERE id_naver = ? ",
        [field],
        (error,results) =>{
            if(error){
                console.log(error);
            } else {
                return res.json({
                    message: "Lista de todos os navers com id: "+field+".",
                    results
                })
            }   
        }
    )
}
exports.list_navers_by_id_projeto = (req,res, next) =>{
    const {field} = req.params;
    console.log(field)
    db.query(
        "SELECT * FROM navers WHERE id_projeto = ? ",
        [field],
        (error,results) =>{
            if(error){
                console.log(error);
            } else {
                return res.json({
                    message: "Lista de todos os navers relacionados com projeto: "+field+".",
                    results
                })
            }   
        }
    )
}

// PESQUISA DE PROJETOS
exports.list_projetos = (req,res) =>{

    const user = req.cookies["acess-token-id"];
    db.query(
        "SELECT * FROM projetos WHERE id_usuario = ?",
        [user],
        (error,result)=>{
            if(error) {
                console.log(error);
            } else {
                db.query(
                    "SELECT * FROM navers WHERE id_usuario = ?",
                    [user],
                    (error,dataNaver)=>{
                        allData=[]
                        for (let i = 0; i < result.length; i++) {
                            const id_naver = result[i].id_usuario
                            allData.push({
                                id_projeto: result[i].id_projeto,
                                id_usuario: result[i].id_usuario,
                                name_projeto: result[i].name_projeto,
                                naver:dataNaver
                            })
                        }
                        return res.status(200).json({
                                message: "Projetos em que o naver "+user+" participou.",
                                data: allData
                        }) 
                    }
                )              
            }
        }
    )
}
exports.list_projetos_by_id = (req,res) =>{
    const {field} = req.params;
    console.log(field)
    db.query(
        "SELECT * FROM projetos WHERE id_projeto = ? ",
        [field],
        (error,results) =>{
            if(error){
                console.log(error);
            } else {
                return res.json({
                    message: "Lista de todos os projetos com id: "+field+".",
                    results
                })
            }   
        }
    )
}
exports.list_projetos_by_id_naver = (req,res) =>{
    const {field} = req.params;
    console.log(field)
    db.query(
        "SELECT * FROM projetos WHERE id_naver = ? ",
        [field],
        (error,results) =>{
            if(error){
                console.log(error);
            } else {
                return res.json({
                    message: "Lista de todos os projetos com id_naver: "+field+".",
                    results
                })
            }   
        }
    )
}


// ALTERAR PROJETO
exports.update_projeto = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const {name_projeto} = req.body;
    const { id_projeto } = req.params;
    db.query(
        "UPDATE projetos SET name_projeto=? WHERE id_usuario = ? AND id_projeto = ?",
        [name_projeto,user,id_projeto],
        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                db.query(
                    "SELECT * FROM projetos WHERE id_usuario = ?",
                    [user],
                    (error,result)=>{
                        if(error) {
                            console.log(error);
                        } else {
                            res.status(200).json({
                                message: "O projeto "+id_projeto+" foi alterado",
                                data:result
                            })
                        }
                    }
                )
            }
        }
    )
    
}   
// ALTERAR NAVER
exports.update_naver = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const {firstName, lastName, birthDate, admissionDate, 
        jobRole} = req.body;
    db.query(

        "UPDATE navers SET firstName = ?, lastName = ?, birthDate = ?, admissionDate = ?, \
        jobRole = ?  WHERE id_usuario = ?",
        [firstName, lastName, birthDate, admissionDate, 
            jobRole, user],

        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                res.status(200).json({
                    message: "O naver de usuario "+user+" foi alterado",
                    data: req.body
                })
            }
        }
    )
}


// DELETAR PROJETO
exports.delete_projeto = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const { id_projeto } = req.params;
    db.query(
        "DELETE FROM projetos WHERE id_usuario = ? AND id_projeto = ?",
        [user,id_projeto],
        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                db.query(
                    "SELECT * FROM projetos WHERE id_usuario = ?",
                    [user],
                    (error,result)=>{
                        if(error) {
                            console.log(error);
                        } else {
                            res.status(200).json({
                                message: "O projeto "+id_projeto+" foi deletado",
                                data:result,
                            })
                        }
                    }
                )
            }
        }
    )
    
}   

// DELETAR NAVER
exports.delete_naver = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    db.query(
        "DELETE FROM navers WHERE id_usuario = ?",
        [user],
        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                res.status(200).json({
                    message: "O naver "+user+" foi deletado",
                    data:results,
                })
            }
        }
    )
    
}  





