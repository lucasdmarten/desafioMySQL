const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

exports.register = (req,res) =>{
    console.log(req.body);
    
    //    const name = req.body.name;
    //    const email = req.body.email;
    //   const password = req.body.password;
    //    const passwordConfirm = req.body.passwordConfirm;
        
    // or
    const {username,email,password,passwordConfirm} = req.body;

    db.query(
        "SELECT email FROM usuarios WHERE email = ?",
        [email],
        async (error, results)=>{
            if(error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render('register', {
                    message: 'That email is already in use'
                })
            } else if(password !== passwordConfirm) {
                return res.render("register", {
                    message: 'Passwords do not match'
                });
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            
            db.query(
                "INSERT INTO usuarios SET ?",
                {
                    username:username,
                    email:email,
                    password: hashedPassword
                },
                (error, results)=>{
                    if (error) {
                        console.log(error);
                    } else {
                        return res.render('register',{
                            message: 'User registered'
                        });
                    }
                });
    })

}

exports.login = async (req,res) =>{
    try {
        const { email, password } = req.body

        // email==false
        if ( !email || !password ) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email],
            async (error, results) =>{
                console.log(results);
                if ( !results || !(await bcrypt.compare(password, results[0].password)) ) {
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect'
                    })
                } else {
                    const id = results[0].id;
                    
                    // or const token = jwt.sign( {id} );
                    const token = jwt.sign( {id:id}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });

                    console.log("The token is: " + token);

                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }

                    res.cookie('jwt', token, cookieOptions);
                    //res.cookie('teste', 'teste', cookieOptions);

                    // or res.status(200).redirect('/?valid=' + token)
                    res.json({
                        email: email,
                        token: token
                    });
                    


                }
            }
        )


    } catch (error) {
        console.log(error)
    }

    

}

exports.add_projeto = async (req,res) =>{
    console.log(req.body)
    const name = req.body.name_projeto
    db.query(
        "SELECT * FROM projetos WHERE name_projeto = ?",
        [name],
        (error, results) =>{
            if (error) {
                console.log("aqui error");
                console.log(error);
            } else {
                console.log("nao deu erro, conferindo results");
                if (results.length > 0) {
                    return res.render('index', {
                        message: 'That project is already exists'
                    });
                }
                db.query(
                    "INSERT INTO projetos SET ?",
                    {
                        name_projeto: name
                    },
                    (error, results) =>{
                        if (error) {
                            console.log('aqui deu erro')
                            console.log(error);
                        } else {
                            return res.json({
                                message: "projeto adicionado",
                                name_projeto: name,
                            })
                        }
                    }
                )
            }
        
        }
    )
}

exports.add_naver = (req,res) =>{
    const {firstName, lastName, birthDate, admissionDate, jobRole, id_projetos} = req.body
    db.query(
        "SELECT * FROM navers WHERE firstName = ?",
        [firstName],
        (error, results) =>{
            if (error) {
                console.log("aqui error");
                console.log(error);
            } else {
                console.log("nao deu erro");               
                db.query(
                    "INSERT INTO navers SET ?",
                    {
                        firstName:firstName,
                        lastName:lastName,
                        birthDate:birthDate,
                        admissionDate:admissionDate,
                        jobRole:jobRole,
                        id_projetos:id_projetos
                    },
                    (error, results) =>{
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            return res.json({
                                message: "naver adicionado",
                                firstName:firstName,
                                lastName:lastName,
                                birthDate:birthDate,
                                admissionDate:admissionDate,
                                jobRole:jobRole,
                                id_projetos:id_projetos
                            })
                        }
                    }
                )
            }
        
        }
    )
}
