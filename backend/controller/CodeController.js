const fs = require('fs');
const path =require('path');
const simpleGit= require('simple-git');

const savingCode=async(req, res)=>{
    try {
        const { team_name,user,message, content } = req.body;
        const teamDir = path.join(process.cwd(), 'repos', team_name);
        

        if (!fs.existsSync(teamDir)) {
            fs.mkdirSync(teamDir, { recursive: true });
        }

        const data = {
            user: user.username,
            message: message
        };


        fs.writeFileSync(path.join(teamDir, "main.py"), content);

        const git = simpleGit(teamDir);

        if (!fs.existsSync(path.join(teamDir, '.git'))) {
            await git.init();
            await git.checkoutLocalBranch('main');
        }

        await git.add('./*');
        await git.commit(JSON.stringify({
            timestamp: new Date().toISOString(),
            user: user.name,
            message
        }, null, 2));

        const log = await git.log();
        const history=log.all.map((commit)=>{
            const obj=JSON.parse(commit.message)
            obj.hash=commit.hash
            return obj
        })


        res.status(200).json({ success:true, message: 'Saved and committed', history });
    } catch (error) {
        console.log("\n\n\n\n\n","Bhai code save karne mai error","\n\n\n\n\n",error)
        res.status(400).json({success:false,error})
    }


   
}

const getAllCodeHistory=async (req,res)=>{
    try {
        console.log("\n\n\n\n",req.body,"\n\n\n\n")
        const { team_name,user } = req.body;
        const teamDir = path.join(process.cwd(), 'repos', team_name);
        if (!fs.existsSync(teamDir)) {
            return res.status(400).json({success:false,error:"Your team hasn't submitted any code yet first save the code then get the history"})
        }

        const git = simpleGit(teamDir);
        console.log("dog1")
        if (!fs.existsSync(path.join(teamDir, '.git'))) {
            res.status(400).json({
                success: false,
                error: "Your team has not saved any code yet."
            });
            console.log("dog2")
            return ;
        }
        console.log("dog3")
        const log = await git.log();
        const enrichedHistory = log.all.map(entry => {
            let meta = {};
            try {
                meta = JSON.parse(entry.message);
            } catch (e) {
                // fallback if commit message wasn't in JSON format
                meta = { message: entry.message };
            }

            return {
                hash: entry.hash,
                date: entry.date,
                user: meta.user || "Unknown",
                message: meta.message || entry.message,
                timestamp: meta.timestamp || entry.date
            };
        });


        console.log("dog4",log)
        res.status(200).json({ success:true, history: enrichedHistory });
    } catch (error) {
        console.log("\n\n\n\n\n","Bhai code history nikalne mai error","\n\n\n\n\n",error)
        res.status(500).json({success:false,error})
    }
    
}

const getCodeAtCommit = async (req, res) => {
    try {
        const { team_name, commitHash } = req.body;
        const teamDir = path.join(process.cwd(), 'repos', team_name);

        if (!fs.existsSync(teamDir)) {
            return res.status(404).json({ success: false, error: "Team repository not found." });
        }

        const git = simpleGit(teamDir);

        // Temporarily check out to the commit
        await git.checkout(commitHash);

        // Read the code
        const content = fs.readFileSync(path.join(teamDir, 'main.py'), 'utf-8');

        // Return to the latest commit (HEAD)
        await git.checkout('main'); // or 'master' depending on what your branch is

        return res.status(200).json({ success: true, code: content });
    } catch (error) {
        console.error("\n\n\n\n\n","Bhai commited code nikalne mai error","\n\n\n\n\n",error);
        return res.status(500).json({ success: false, error: error.message });
    }
};




const conductingChallenges=async (req,res)=>{
    
}





module.exports = {savingCode,getCodeAtCommit,getAllCodeHistory}