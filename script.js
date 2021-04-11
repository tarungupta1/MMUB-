const pup = require("puppeteer");
const fs = require("fs");


let tab;
let brow;
let CovidData = [];
let finalData = "";
async function main() {
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });
    brow = browser;
    let pages = await browser.pages();
    tab = pages[0];

    await tab.goto("https://www.google.com");
    await tab.waitForSelector(".gLFyf.gsfi", {visible: true});
    await tab.click(".gLFyf.gsfi");
    let data1 = "coronavirus";
    await tab.type(".gLFyf.gsfi", data1);
    await tab.keyboard.press("Enter");
    

    await tab.waitForNavigation({ waitUntil: "networkidle2" });   

    let first = {};
    let finalnews = [];  
    await inserting_news(finalnews);
    first["TOP Stories"] = finalnews;


    var covidOptions = await tab.$$(".FZzi2e.MjJo9");

    let cases = {};
    await inserting_total_cases(cases, covidOptions);
    first["Today's News"] = cases;
    CovidData.push(first);


    await inserting_health_info(covidOptions);
    

    let second = {};
    await inserting_covid_count(second, covidOptions);
    CovidData.push(second);


    let third = {};
    await inserting_vaccines_count(third, covidOptions);
    CovidData.push(third);


    await tab.waitForSelector(".FZzi2e.MjJo9");
    covidOptions = await tab.$$(".FZzi2e.MjJo9");
    let fourth = {};
    await inserting_testing_centres(fourth, covidOptions);
    CovidData.push(fourth);
    

    await tab.waitForSelector(".FZzi2e.MjJo9");
    let fifth = {};
    await inserting_vaccine_centres(fifth);
    CovidData.push(fifth);


    await tab.waitForSelector(".FZzi2e.MjJo9");
    covidOptions = await tab.$$(".FZzi2e.MjJo9");
    let sixth = {};
    await inserting_vaccine_side_effects(sixth, covidOptions);
    CovidData.push(sixth);



    fs.writeFileSync("data1.txt", finalData);
    fs.writeFileSync("data.json", JSON.stringify(CovidData));
    
    brow.close();
}

async function inserting_news(finalnews){
    
    let titlenewsclass = await tab.$$(".fhQnRd");
    let top_stories = await titlenewsclass[0].$$(".E7YbUb");
    for(let i in top_stories){

        let news_link_class = await top_stories[i].$$(".WlydOe");
        let news_link = await tab.evaluate(function (ele) {
            return ele.getAttribute("href");
        }, news_link_class[0]);

        let news_headlines_class = await top_stories[i].$$(".mCBkyc.oz3cqf.p5AXld.nDgy9d");
        let news_headlines = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, news_headlines_class[0]);

        let news = {};
        news["Headlines"] = news_headlines;
        news["Url"] = news_link;
        finalnews.push(news);       
    }
}

async function inserting_total_cases(cases, covidOptions){
    await covidOptions[1].click();
        
    await tab.waitForSelector(".dZdtsb.QmWbpe.ZDeom", {visible: true});
    let statscount = await tab.$$(".dZdtsb.QmWbpe.ZDeom");  
    
    for(let i in statscount){
        if(i == 3){
            break;
        }

        let name = await tab.$$(".amyZLb");
        let data1 = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, name[i]);
                
        let value = await tab.$$(".m7B03 div span");
        let data2 = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, value[i*4]);
                
        cases[data1] = data2;

    }    
}

async function inserting_health_info(covidOptions){
    await covidOptions[2].click();

    await tab.waitForSelector("#kp-wp-tab-HealthOutbreakMedicalInfo");
    let whole_page = await tab.$$("#kp-wp-tab-HealthOutbreakMedicalInfo");

    let chooseOptions = await whole_page[0].$$(".lmqm0b.u8H8Fd.vjpVxf a");   
    
    for(let i in chooseOptions){
        await chooseOptions[i].click();        
        await tab.waitForSelector(".FZzi2e");
        let name_class  = await chooseOptions[i].$$(".FZzi2e");
        let name = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, name_class[0]);

        if(i == 0){
            let data = "";            
            await new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve();
                }, 1000);
            });
            let content1 = await tab.$$(".Z0mB9b .PZPZlf div span");
            for(let k in content1){
                data = data + "\r\n" + await tab.evaluate(function (ele) {
                    return ele.textContent;
                }, content1[k]);
            }

            finalData = finalData + name + "\r\n" + data + "\r\n ----------- \r\n\r\n\r\n";
        }
        else if(i == 1){
            let data = "";
            await new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve();
                }, 1000);
            });
            let content1 = await tab.$$(".bVNaN .PZPZlf div span");
            for(let k in content1){
                data = data + "\r\n" + await tab.evaluate(function (ele) {
                    return ele.textContent;
                }, content1[k]);
            }

            finalData = finalData + name + "\r\n" + data + "\r\n ----------- \r\n\r\n\r\n";
        }
        else{
            let data = "";

            await new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve();
                }, 1000);
            });

            var content1 = await tab.$$(".BpuzOe .PZPZlf div");
            for(let k in content1){
                if(k==29){
                    break;
                }
                if(k==0){
                    data += "\r\nSelf-Care";
                }
                else if(k==15){
                    data += "\r\n\r\nMedical Treatment";
                }
                data = data + "\r\n" + await tab.evaluate(function (ele) {
                    return ele.textContent;
                }, content1[k]);
            }

            finalData += name + "\r\n" + data + "\r\n ----------- \r\n\r\n\r\n ";
        }
    }
}

async function inserting_covid_count(second, covidOptions){
    await covidOptions[1].click();
    await tab.waitForSelector(".oCEWs", {visible: true});
    await tab.click(".oCEWs");
    await tab.click(".oCEWs");
    let statecount = await tab.$$(".ZDcxi table tbody tr");
    let stateWiseCases = {};
    let detail_info = ["Total Cases", "Recovered", "Deaths"];
    for(let i in statecount){
        let stateclass = await statecount[i].$$("td");
        let state_name;

        let info = {};
        for(let j in stateclass){
            
            if(j == 0){
                let inner_core = await stateclass[j].$$(".OrdL9b");
                let state_data = await tab.evaluate(function(ele){
                    return ele.textContent;
                }, inner_core[0]);
                state_name = state_data;
            }    
            else{                
                let inner_core = await stateclass[j].$$("div div span");
                let state_data = await tab.evaluate(function(ele){
                    return ele.textContent;
                }, inner_core[0]);
                info[detail_info[j-1]] = state_data;
            }
        }

        stateWiseCases[state_name] = info;
    }
    second["State Wise Covid Cases"]  = stateWiseCases; 
}

async function inserting_vaccines_count(third, covidOptions){
    await covidOptions[1].click();  
    await tab.waitForSelector(".GJi8Lc .ZldK9c.GLkkZe", {visible: true});
    let vaccine_link = await tab.$$(".GJi8Lc .ZldK9c.GLkkZe");
    await vaccine_link[0].click();

    await tab.waitForSelector("#eTST2", {visible: true});
    
    let vaccine_title_class = await tab.$$(".xP45xc.K5Jpdc.V88cHc.ITWYTc");
    let vaccine_title = await tab.evaluate(function (ele) {
        return ele.textContent;
    }, vaccine_title_class[0]);

    let title_of_total_doses_class = await tab.$$(".UqYCMc .yBRuSd");       
    let data = {};
    for(let i in title_of_total_doses_class){
        let data1 = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, title_of_total_doses_class[i]);
         
        let value = await tab.$$(".JCBWZ div span");
        let data2 = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, value[i*4]);

        data[data1] = data2;
    }    
    third["Total Vaccinations"] = data;

    for(let i=0; i<4; i++){
        await tab.click(".oCEWs");
    }
    let countrycount = await tab.$$(".ZDcxi table tbody tr");
    let countryWisevaccines = {};
    let detail_info = ["Doses Given"];
    
    for(let i in countrycount){
        let countryclass = await countrycount[i].$$("td");
        let country_name;

        let info = {};
        for(let j in countryclass){
            
            if(j == 0){
                let inner_core = await countryclass[j].$$(".OrdL9b");
                let country_data = await tab.evaluate(function(ele){
                    return ele.textContent;
                }, inner_core[0]);
                country_name = country_data;
            }    
            else if(j == 1){                
                let inner_core = await countryclass[j].$$("div div span");
                let country_data = await tab.evaluate(function(ele){
                    return ele.textContent;
                }, inner_core[0]);
                info[detail_info[j-1]] = country_data;
            }
        }
        countryWisevaccines[country_name] = info;
    }
    third[vaccine_title] = countryWisevaccines;  


    await tab.goBack();
    await new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, 3000);
    });
    
}

async function inserting_testing_centres(fourth, covidOptions){
    await covidOptions[3].click();  

    await tab.waitForSelector(".ndElDd");
    await tab.click(".ndElDd");

    await tab.waitForSelector(".rlfl__tls.rl_tls");

    let centre_list = {};
    let list_of_centres = await tab.$$(".rlfl__tls.rl_tls .VkpGBb");
    for(let i in list_of_centres){
        let centre_name_class = await list_of_centres[i].$$(".dbg0pd");
        let centre_name = await tab.evaluate(function (ele){
            return ele.textContent;
        }, centre_name_class[0]);
        

        let centre_details = {};

        let website_class = await list_of_centres[i].$$(".TGKDNe.yYlJEf.L48Cpd");
        let website;
        if(website_class.length == 0){
            website = "NA";
        }
        else{
            website = await tab.evaluate(function (ele) {
                return ele.getAttribute("href");
            }, website_class[0]);
        }
        centre_details["Website"] = website;


        let address_class = await list_of_centres[i].$$(".rllt__details.lqhpac .f5Sf1");
        let address;
        if(address_class.length == 0){
            address = "NA";
        }
        else{
            address = await tab.evaluate(function (ele){
                return ele.textContent;
            }, address_class[0]);
        }
        centre_details["Address"] = address;


        let details_class = await list_of_centres[i].$$(".rllt__details.lqhpac .dXnVAb .BI0Dve");
        let data = [];
        for(let j in details_class){
            let details = await tab.evaluate(function (ele){
                return ele.textContent;
            }, details_class[j]);
            data.push(details);
        }
        centre_details["Other Details"] = data;

        centre_list[centre_name] = centre_details;        
    }
    fourth["Testing Centres"] = centre_list;

    await tab.goBack();
    await new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, 3000);
    });
}

async function inserting_vaccine_centres(fifth){

    let text = "Covid vaccine centres near me";
    
    await tab.click(".gLFyf.gsfi");
    await tab.keyboard.down("Control");
    await tab.keyboard.press("A");
    await tab.keyboard.up("Control");
    await tab.keyboard.press("Delete");
    await tab.type(".gLFyf.gsfi", text);
    await tab.keyboard.press("Enter");

    await tab.waitForNavigation({ waitUntil: "networkidle2" });
    
    await tab.waitForSelector(".ndElDd");
    await tab.click(".ndElDd");

    await tab.waitForSelector(".rlfl__tls.rl_tls");

    let centre_list = {};
    let list_of_centres = await tab.$$(".rlfl__tls.rl_tls .VkpGBb");

    for(let i in list_of_centres){
        let centre_name_class = await list_of_centres[i].$$(".dbg0pd");
        let centre_name = await tab.evaluate(function (ele){
            return ele.textContent;
        }, centre_name_class[0]);
        

        let centre_details = {};

        let website_class = await list_of_centres[i].$$(".TGKDNe.yYlJEf.L48Cpd");
        let website;
        if(website_class.length == 0){
            website = "NA";
        }
        else{
            website = await tab.evaluate(function (ele) {
                return ele.getAttribute("href");
            }, website_class[0]);
        }
        centre_details["Website"] = website;


        let address_class = await list_of_centres[i].$$(".rllt__details.lqhpac .f5Sf1");
        let address;
        if(address_class.length == 0){
            address = "NA";
        }
        else{
            address = await tab.evaluate(function (ele){
                return ele.textContent;
            }, address_class[0]);
        }
        centre_details["Address"] = address;


        let details_class = await list_of_centres[i].$$(".rllt__details.lqhpac .dXnVAb .BI0Dve");
        let data = [];
        for(let j in details_class){
            let details = await tab.evaluate(function (ele){
                return ele.textContent;
            }, details_class[j]);
            data.push(details);
        }
        centre_details["Other Details"] = data;

        let instructions_class = await tab.$$(".rxSVje.rllt__wrapped");
        let instructions = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, instructions_class[i]);
        centre_details["Instructions"] = instructions;

        centre_list[centre_name] = centre_details;        
    }
    fifth["Vaccination Centres"] = centre_list;

    await tab.goBack();
    await new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, 3000);
    });   
}

async function  inserting_vaccine_side_effects(sixth, covidOptions) {
    await covidOptions[5].click();
    
    await tab.waitForNavigation({ waitUntil: "networkidle2" });

    await tab.waitForSelector(".krw0Mb"); 
    let heading_class = await tab.$$(".krw0Mb");
    let heading = await tab.evaluate(function(ele){
        return ele.textContent;
    }, heading_class[0]);
    
    
    let body_class = await tab.$$(".QsuZMe.oLxzIf")   
    let body = await tab.evaluate(function(ele){
        return ele.textContent;
    }, body_class[0]);

    finalData = finalData + heading +"\r\n" + body + "\r\n ----------- \r\n\r\n\r\n";

}

main();

