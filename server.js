const express = require("express");

const cors = require("cors");

const path = require("path");

require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// HOME PAGE

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

// SIGNUP API

app.post("/signup", async (req, res) => {

    try{

        const { username, mobile } = req.body;

        if(!username || !mobile){

            return res.json({
                success:false,
                message:"All fields required"
            });

        }

        const { data:existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("mobile", mobile)
            .maybeSingle();

        if(existingUser){

            return res.json({
                success:false,
                message:"Mobile already exists"
            });

        }

        const { error } = await supabase
            .from("users")
            .insert([
                {
                    username,
                    mobile
                }
            ]);

        if(error){

            return res.json({
                success:false,
                message:error.message
            });

        }

        res.json({
            success:true
        });

    }catch(error){

        console.log(error);

        res.json({
            success:false,
            message:"Server Error"
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running On ${PORT}`);

});
