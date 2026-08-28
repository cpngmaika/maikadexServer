import User from "../models/User.js";

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = {
        email: "",
        password: "",
    };

    // duplicate email error
    if (err.code === "ER_DUP_ENTRY") {
        errors.email = "that email is already registered";
        return errors;
    }

    // validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return { message: err.message || "Something went wrong" };
};

// controller actions
export const signup_get = (req, res) => {
    res.render("signup");
};

export const login_get = (req, res) => {
    res.render("login");
};

export const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });

        res.status(201).json(user);
    } catch (err) {
        const errors = handleErrors(err);

        res.status(400).json({ errors });
    }
};

export const login_post = async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    res.send("user login");
};
