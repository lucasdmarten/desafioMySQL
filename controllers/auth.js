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
        "SELECT email FROM users WHERE email = ?",
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
                "INSERT INTO users SET ?",
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
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (error, results) =>{
                console.log(results);
                if ( !results || !(await bcrypt.compare(password, results[0].password)) ) {
                    res.status(401).json({
                        message: 'Email or Password is incorrect'
                    })
                } else {
                    const id = results[0].id_user;
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
                        message: "User:"+id+" is connected!",
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
            id_user: user
        },
        (error, results) =>{
            if (error) {
                console.log(error);
          
                return res.status(400).json({
                    message: "User already register a naver."
                })
            } else {
                //console.log(results);
                return res.json({
                    message: "Add naver id: "+user+".",
                    data: {
                        firstName:firstName,
                        lastName:lastName,
                        birthDate:birthDate,
                        admissionDate:admissionDate,
                        jobRole:jobRole,
                        id_user:user
                    }
                })
            }
        }
    )
};
exports.add_project = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const {name_project } = req.body;

    db.query(
        "SELECT * FROM navers WHERE id_user = ?",
        [user],
        (erro, results) =>{
            if (erro) {
                console.log(erro);
            } else if (results.length < 0) {
                console.log(results.length);
                res.status(400).json({
                    message: "error"
                })
            } else {
                console.log(results)
                const id_naver = results[0].id_naver;
                db.query(
                    "INSERT INTO projects SET ?",
                    {
                        name_project: name_project,
                        id_user: user
                        
                    },
                    (error, results) =>{
                        if (error) {
                            console.log(error);
                        } else {
                            return res.json({
                                message: "User: "+user+" add project: "+name_project+".",
                                id_usuario: user,
                                name_projeto: name_project,
                                id_naver: id_naver
                            })
                        }
                    }
                )  
            }
        }
    )    
}

exports.list_navers = (req,res, next) =>{
    const user = req.cookies["acess-token-id"];
    db.query(
        "SELECT * FROM navers WHERE id_user = ?",
        [user],
        (error,dataNaver) =>{
            if(error){
                console.log(error);
                res.status(400).json({
                    message: "error"
                })
            } else {
                console.error("query");
                db.query(
                    "SELECT * FROM projects WHERE id_user = ?",
                    [user],
                    (erro, dataProjects) =>{
                        if (erro) {
                            console.log(erro);
                        } else if (dataProjects.length < 0) {
                            console.log(dataProjects.length);
                            res.status(400).json({
                                message: "error"
                            })
                        } else {
                            console.log(dataProjects)
                            res.status(200).json({
                                message: "Naver created by id: "+user,
                                id_naver:dataNaver[0].id_user,
                                id_user:dataNaver[0].id_user,
                                firstName:dataNaver[0].firstName,
                                lastName:dataNaver[0].lastName,
                                birthDate:dataNaver[0].birthDate,
                                admissionDate:dataNaver[0].admissionDate,
                                jobRole:dataNaver[0].jobRole,
                                projects: {
                                    message: "List of projects of naver: "+user+".",
                                    data: dataProjects
                                }
                            })
                        }
                    }
                )
            }   
        }
    )
};
// exports.list_navers_by_id = (req,res, next) =>{
//     const {field} = req.params;
//     console.log(field)
//     db.query(
//         "SELECT * FROM navers WHERE id_naver = ? ",
//         [field],
//         (error,results) =>{
//             if(error){
//                 console.log(error);
//             } else {
//                 return res.json({
//                     message: "Lista de todos os navers com id: "+field+".",
//                     results
//                 })
//             }   
//         }
//     )
// }
// exports.list_navers_by_id_projeto = (req,res, next) =>{
//     const {field} = req.params;
//     console.log(field)
//     db.query(
//         "SELECT * FROM navers WHERE id_projeto = ? ",
//         [field],
//         (error,results) =>{
//             if(error){
//                 console.log(error);
//             } else {
//                 return res.json({
//                     message: "Lista de todos os navers relacionados com projeto: "+field+".",
//                     results
//                 })
//             }   
//         }
//     )
// }

exports.list_projects = (req,res) =>{

    const user = req.cookies["acess-token-id"];
    db.query(
        "SELECT * FROM projects1 WHERE id_user = ?",
        [user],
        (error,result)=>{
            if(error) {
                console.log(error);
            } else {
                db.query(
                    "SELECT * FROM navers WHERE id_user = ?",
                    [user],
                    (error,dataNaver)=>{
                        allData=[]
                        for (let i = 0; i < result.length; i++) {
                            const id_naver = result[i].id_user
                            allData.push({
                                id_projeto: result[i].id_projeto,
                                id_user: result[i].id_user,
                                name_project: result[i].name_project,
                                naver:dataNaver
                            })
                        }
                        return res.status(200).json({
                                message: "Projects of naver "+user+" work.",
                                data: allData
                        }) 
                    }
                )              
            }
        }
    )
}
// exports.list_projetos_by_id = (req,res) =>{
//     const {field} = req.params;
//     console.log(field)
//     db.query(
//         "SELECT * FROM projetos WHERE id_projeto = ? ",
//         [field],
//         (error,results) =>{
//             if(error){
//                 console.log(error);
//             } else {
//                 return res.json({
//                     message: "Lista de todos os projetos com id: "+field+".",
//                     results
//                 })
//             }   
//         }
//     )
// }

// exports.list_projetos_by_id_naver = (req,res) =>{
//     const {field} = req.params;
//     console.log(field)
//     db.query(
//         "SELECT * FROM projetos WHERE id_naver = ? ",
//         [field],
//         (error,results) =>{
//             if(error){
//                 console.log(error);
//             } else {
//                 return res.json({
//                     message: "Lista de todos os projetos com id_naver: "+field+".",
//                     results
//                 })
//             }   
//         }
//     )
// }


exports.update_project = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const {name_project} = req.body;
    const { id_project } = req.params;
    db.query(
        "UPDATE projects SET name_project=? WHERE id_user = ? AND id_project = ?",
        [name_project,user,id_project],
        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                db.query(
                    "SELECT * FROM projects WHERE id_user = ?",
                    [user],
                    (error,result)=>{
                        if(error) {
                            console.log(error);
                        } else {
                            res.status(200).json({
                                message: "The project "+id_project+" was modified",
                                data:result
                            })
                        }
                    }
                )
            }
        }
    )
    
}   

exports.update_naver = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const {firstName, lastName, birthDate, admissionDate, 
        jobRole} = req.body;
    db.query(

        "UPDATE navers SET firstName = ?, lastName = ?, birthDate = ?, admissionDate = ?, \
        jobRole = ?  WHERE id_user = ?",
        [firstName, lastName, birthDate, admissionDate, 
            jobRole, user],

        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                res.status(200).json({
                    message: "The Naver "+user+" was modified",
                    data: req.body
                })
            }
        }
    )
}


exports.delete_project = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    const { id_project } = req.params;
    db.query(
        "DELETE FROM projects WHERE id_user = ? AND id_project = ?",
        [user,id_project],
        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                db.query(
                    "SELECT * FROM projects WHERE id_user = ?",
                    [user],
                    (error,result)=>{
                        if(error) {
                            console.log(error);
                        } else {
                            res.status(200).json({
                                message: "The project "+id_project+" was deleted",
                                data:result,
                            })
                        }
                    }
                )
            }
        }
    )
    
}   

exports.delete_naver = (req,res) =>{
    const user = req.cookies['acess-token-id'];
    db.query(
        "DELETE FROM navers WHERE id_user = ?",
        [user],
        (error, results)=>{
            if(error) {
                console.log(error);
            } else {
                res.status(200).json({
                    message: "Naver "+user+" was deleted.",
                    data:results,
                })
            }
        }
    )
    
}  





