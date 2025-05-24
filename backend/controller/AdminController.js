const { exec } = require("child_process");
const path = require("path");
const {Team} = require("../models/models")
const readline = require('readline');


const fs=require("fs")

const conductPrimaryMatches=async (req,res)=>{
    try {
        const scriptPath = path.join(__dirname, "..","run_primary_matches.py");
        console.log("\n\n\n\n",scriptPath,"\n\n\n\n")
        exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            console.error("stderr:", stderr);
            console.log("Match script output:", stdout);
            
            
            if (error) {
                console.error("Error running match script:", error);
                return res.status(500).json({ success: false, error: error.message });
            }


            res.status(200).json({ success: true, message: "Matches completed", output: stdout });
        });
    } catch (error) {
        console.log("\n\n\n",error,"\n\n\n")
        res.status(500).json({success:false,error,message:"bhai primary match to nahi ho paaye"})
    }

}







const getResultOfRoundOne=async (req,res)=>{
    
    try {
        const all_teams = await Team.findAll();
        let team_details = [];
        
        // Process files in parallel using Promise.all
        const fileProcessingPromises = all_teams.map(async (team) => {
            const filePath = path.join(__dirname, "../match_logs/Match1", `${team.dataValues.name}_vs_bot1.log`);
            const resolved=fs.existsSync(filePath)
            console.log("\n\n\n",resolved,filePath)
            if(resolved){
                return new Promise((resolve, reject) => {
                    const file_stream = fs.createReadStream(filePath);
                    const rl = readline.createInterface({
                        input: file_stream,
                        crlfDelay: Infinity
                    });

                    rl.on('line', (line) => {
                        if (line.startsWith("final score")) {
                            const final_score = line.split(":")[1].trim();
                            team_details.push({
                                name: team.dataValues.name,
                                score: final_score
                            });
                        }
                    });

                    rl.on('close', resolve);
                    rl.on('error', reject);
                });
            }else{
                return new Promise((resolve, reject) =>{
                    if (1){
                        resolve({})
                    }
                })
            }
        });

        // Wait for all files to be processed
        await Promise.all(fileProcessingPromises);
        console.log("\n\n\n",team_details,"\n\n\n")
        // Update team scores in database
        const updatePromises = team_details.map(async (teamDetail) => {
            if(teamDetail!={}){
                try {
                    const team = await Team.findOne({ where: { name: teamDetail.name } });
                    if (team) {
                        team.score = teamDetail.score;
                        await team.save(); // Use save() instead of update()
                    }
                } catch (error) {
                    console.error(`Error updating team ${teamDetail.name}:`, error);
                }
            }else{
                return new Promise((resolve, reject) =>{
                    if (1){
                        resolve({})
                    }
                })
            }
        });

        await Promise.all(updatePromises);

        let listToBeSorted=await Team.findAll()
        listToBeSorted=listToBeSorted.map((data)=>{
            return data.dataValues
        })
        console.log(listToBeSorted)
        let sortedList=listToBeSorted.sort((a,b)=> (b.score-a.score))
        console.log(sortedList)

        res.status(200).json({ success: true, message: "Secondary matches processed successfully" ,resultRoundOne:sortedList});
    } catch (error) {
        console.error("Error in conductSecondaryMatches:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to process secondary matches" 
        });
    }

}






const conductSecondaryMatches = async (req, res) => {
    try {

        //getting teams least sorted by scores
        const all_teams = await Team.findAll();
        let team_details = [];
        
        // Process files in parallel using Promise.all
        const fileProcessingPromises = all_teams.map(async (team) => {
            const filePath = path.join(__dirname, "../match_logs/Mathch1", `${team.dataValues.name}_vs_bot1.log`);
            const resolved=fs.existsSync(path)
            if(resolved){
                return new Promise((resolve, reject) => {
                    const file_stream = fs.createReadStream(filePath);
                    const rl = readline.createInterface({
                        input: file_stream,
                        crlfDelay: Infinity
                    });

                    rl.on('line', (line) => {
                        if (line.startsWith("final score")) {
                            const final_score = line.split(":")[1].trim();
                            team_details.push({
                                name: team.dataValues.name,
                                score: final_score
                            });
                        }
                    });

                    rl.on('close', resolve);
                    rl.on('error', reject);
                });
            }else{
                return new Promise((resolve, reject) =>{
                    if (1){
                        resolve({})
                    }
                })
            }
        });

        // Wait for all files to be processed
        await Promise.all(fileProcessingPromises);

        // Update team scores in database
        const updatePromises = team_details.map(async (teamDetail) => {
            if(teamDetail!={}){
                try {
                    const team = await Team.findOne({ where: { name: teamDetail.name } });
                    if (team) {
                        team.score = teamDetail.score;
                        await team.save(); // Use save() instead of update()
                    }
                } catch (error) {
                    console.error(`Error updating team ${teamDetail.name}:`, error);
                }
            }else{
                return new Promise((resolve, reject) =>{
                    if (1){
                        resolve({})
                    }
                })
            }
        });

        await Promise.all(updatePromises);

        let listToBeSorted=await Team.findAll()
        listToBeSorted=listToBeSorted.map((data)=>{
            return data.dataValues
        })
        console.log(listToBeSorted)
        let sortedList=listToBeSorted.sort((a,b)=> (b.score-a.score))
        console.log(sortedList)
        
        


        //
        const jsonString = JSON.stringify(sortedList);


        const scriptPath = path.join(__dirname, "..","run_secondary_matches.py");
        console.log("\n\n\n\n",scriptPath,"\n\n\n\n")
        const pythonProcess=exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            console.error("stderr:", stderr);
            console.log("Match script output:", stdout);
            
            
            if (error) {
                console.error("Error running match script:", error);
                return res.status(500).json({ success: false, error: error.message });
            }


            // res.status(200).json({ success: true, message: "Matches completed", output: stdout });
        });

        pythonProcess.stdin.write(jsonString);
        pythonProcess.stdin.end();

        res.status(200).json({ success: true, message: "Secondary matches processed successfully" });
    } catch (error) {
        console.error("Error in conductSecondaryMatches:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to process secondary matches" 
        });
    }
};

const conductChallenges=async (req,res)=>{
    try {
        const {challengerBot,botToChallenge}=req.body
        const jsonString = JSON.stringify({challengerBot,botToChallenge})
        const scriptPath = path.join(__dirname, "..","run_challenges.py");
        const pythonProcess=exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            console.error("stderr:", stderr);
            console.log("Match script output:", stdout);

            const filePath = path.join(__dirname, '..',"/match_logs/game_log.csv");
  
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return res.status(404).send('File not found');
            }

            // Set headers for file download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=download.csv');
            
            // Create read stream and pipe to response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            if (error) {
                console.error("Error running match script:", error);
                return res.status(500).json({ success: false, error: error.message });
            }


            // res.status(200).json({ success: true, message: "Matches completed", output: stdout });
        });

        pythonProcess.stdin.write(jsonString);
        pythonProcess.stdin.end();

        // res.status(200).json({})
    } catch (error) {
        
    }
}

module.exports = {conductPrimaryMatches,conductSecondaryMatches,conductChallenges,getResultOfRoundOne}