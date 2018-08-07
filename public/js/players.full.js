/* --------------- */
/* /players/search */
/* --------------- */

let q = 0;
function SearchPlayer(searchVal, Extensive, end) {
    const searchField = searchVal;
    const ResultsTable = document.getElementById("results");
    if (q > 0) {return};
    if (searchField == "" | searchField.length < 2)  {
        if (ResultsTable.style.display === "table") {
            ResultsTable.style.display = "none";
        }
        $("#results tbody").empty();
        return;
    }

    q = 1;
    $.ajax({
        async: true,
        type: 'POST',
        url: '/Players/Search',
        data: {
            SearchVal: searchField,
            Extensive: Extensive
        },
        success: function(data) {
            if (data.Error !== undefined) {return console.log(data.Error)};
            if (data.Results == false) {
                if (ResultsTable.style.display === "none") {
                    ResultsTable.style.display = "table";
                }

                $("#results tbody").empty();
                $('#results > tbody:last-child').append('<tr><td>-1</td><td>No Results Found</td><td>-1</td></tr>');
            } else {
                if (ResultsTable.style.display === "none") {
                    ResultsTable.style.display = "table";
                }

                $("#results tbody").empty();
                for (i = 0; i < data.Results.length; i++) {
                    player = data.Results[i];
                    $('#results > tbody:last-child').append('<tr><th scope="row">'+player["id"]+'</th><td>'+player["Last Name"]+'</td><td>'+player["Steam64ID"]+'</td><td><a type="button" class="btn-sm btn-cyan" href="/Players/'+player["id"]+'">View Player</a></td></tr>');
                };
            }
            q = 0;
            if (end == undefined) {
                setTimeout(function(){ 
                    if (q > 0) return; else SearchPlayer(searchVal, true, true);
                }, 1000);
            }
        },
        error: function(error) {
            q = 0;
            return console.log(error);
        }
    });
}


/* ------------------ */
/* /players/:playerid */
/* ------------------ */
function LoadPlayer(load, playerID) {
    const Load = load;
    Load.forEach(function(item) {
        $.ajax({
            async: true,
            type: 'POST',
            url: '/Players/'+playerID+'/Info',
            data: {
                Option: "Get",
                Option2: item
            },
            success: function(data) {
                if (data.Error !== undefined) {
                    return console.log(data.Error)
                } else if (data[item] == false) {
                    switch (item) {
                        case "Names":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No Names Found</td></tr>');
                            break;
                        case "Bans":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No Bans Found</td></tr>');
                            break;
                        case "Kicks":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No Kicks Found</td></tr>');
                            break;
                        case "Kills":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No Kills Found</td></tr>');
                            break;
                        case "MaldenLife":
                            $('#'+item+' > tbody:last-child').append('<tr><td>Player has never joined server</td></tr>');
                            break;
                        case "Vehicles":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No Vehicles Found</td></tr>');
                            break;
                    }
                } else {
                    const Data = data[item];
                    for (i = 0; i < Data.length; i++) {
                        info = Data[i];
                        switch (item) {
                            case "Names":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Name"]+'</td><td>'+info["Time"]+'</td></tr>');
                                break;
                            case "Bans":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Reason"]+'</td><td>'+info["Created"]+'</td><td>'+info["Expires"]+'</td></tr>');
                                break;
                            case "Kicks":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Name"]+'</td><td>'+info["Reason"]+'</td><td>'+info["Time"]+'</td></tr>');
                                break;
                            case "Kills":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Name"]+'('+info["KilledGroup"]+')</td><td>'+info["Weapon"]+'</td><td>'+info["Time"]+'</td></tr>');
                                break;
                            case "MaldenLife":
                                $('#'+item+' > tbody:last-child').append('<tr><td>$'+info["Money"]+'</td><td>'+info["coplevel"]+'</td><td>'+info["mediclevel"]+'</td><td>'+info["donorlevel"]+'</td><td>'+info["exp_level"]+'</td><td>'+info["exp_total"]+'</td><td>'+info["exp_perkPoints"]+'</td></tr>');
                                break;
                            case "Vehicles":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["side"]+'</td><td>'+info["classname"]+'</td><td>'+info["type"]+'</td><td>'+info["plate"]+'</td><td>'+info["gear"]+'</td><td>'+info["inventory"]+'</td><td>'+info["insure"]+'</td><td>'+moment(info["insert_time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                                break;
                        }
                    };
                }
            },
            error: function(error) {
                return console.log(error);
            }
        });
    });
};

function getPlayerData(playerID, item, option) {
    $.ajax({
        async: true,
        type: 'POST',
        url: '/Players/'+playerID+'/Info',
        data: {
            Option: "Get",
            Option2: item,
            Option3: option
        },
        success: function(data) {
            if (data.Error !== undefined) {
                return console.log(data.Error)
            } else if (data[item] == false) {
                $('#'+item+' tbody').empty();
                switch (item) {
                    case "Names":
                        $('#'+item+' > tbody:last-child').append('<tr><td>No Names Found</td></tr>');
                        break;
                    case "Bans":
                        $('#'+item+' > tbody:last-child').append('<tr><td>No Bans Found</td></tr>');
                        switch (option) {
                            case "All":
                                $('#BansText').html('Current Bans <button type="button" class="btn-sm btn-blue-grey" onClick="getPlayerData('+playerID+',\'Bans\',\'\');">Show Expired</button>');
                                break;
                            case "":
                                $('#BansText').html('Current Bans <button type="button" class="btn-sm btn-elegant" onClick="getPlayerData('+playerID+',\'Bans\',\'All\');">Show Expired</button>');
                                break;
                        }
                        break;
                    case "Kicks":
                        $('#'+item+' > tbody:last-child').append('<tr><td>No Kicks Found</td></tr>');
                        break;
                    case "Kills":
                        $('#'+item+' > tbody:last-child').append('<tr><td>No Kills Found</td></tr>');
                        switch (option) {
                            case "All":
                                $('#KillsText').html('Current Bans <button type="button" class="btn-sm btn-blue-grey" onClick="getPlayerData('+playerID+',\'Kills\',\'\');">Show Deaths</button>');
                                break;
                            case "":
                                $('#KillsText').html('Current Bans <button type="button" class="btn-sm btn-elegant" onClick="getPlayerData('+playerID+',\'Kills\',\'All\');">Show Deaths</button>');
                                break;
                        }
                        break;
                    case "MaldenLife":
                        $('#'+item+' > tbody:last-child').append('<tr><td>Player has never joined server</td></tr>');
                        break;
                    case "Vehicles":
                        $('#'+item+' > tbody:last-child').append('<tr><td>No Vehicles Found</td></tr>');
                        break;
                }
            } else {
                $('#'+item+' tbody').empty();
                const Data = data[item];
                for (i = 0; i < Data.length; i++) {
                    info = Data[i];
                    switch (item) {
                        case "Names":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Name"]+'</td><td>'+info["Time"]+'</td></tr>');
                            break;
                        case "Bans":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Reason"]+'</td><td>'+info["Created"]+'</td><td>'+info["Expires"]+'</td></tr>');
                            switch (option) {
                                case "All":
                                    $('#BansText').html('Current Bans <button type="button" class="btn-sm btn-blue-grey" onClick="getPlayerData('+playerID+',\'Bans\',\'\');">Show Expired</button>');
                                    break;
                                case "":
                                    $('#BansText').html('Current Bans <button type="button" class="btn-sm btn-elegant" onClick="getPlayerData('+playerID+',\'Bans\',\'All\');">Show Expired</button>');
                                    break;
                            }
                            break;
                        case "Kicks":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Name"]+'</td><td>'+info["Reason"]+'</td><td>'+info["Time"]+'</td></tr>');
                            break;
                        case "Kills":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Name"]+'('+info["KilledGroup"]+')</td><td>'+info["Weapon"]+'</td><td>'+info["Time"]+'</td></tr>');
                            switch (option) {
                                case "All":
                                    $('#KillsText').html('Current Bans <button type="button" class="btn-sm btn-blue-grey" onClick="getPlayerData('+playerID+',\'Kills\',\'\');">Show Deaths</button>');
                                    break;
                                case "":
                                    $('#KillsText').html('Current Bans <button type="button" class="btn-sm btn-elegant" onClick="getPlayerData('+playerID+',\'Kills\',\'All\');">Show Deaths</button>');
                                    break;
                            }
                            break;
                        case "MaldenLife":
                            $('#'+item+' > tbody:last-child').append('<tr><td>$'+info["Money"]+'</td><td>'+info["coplevel"]+'</td><td>'+info["mediclevel"]+'</td><td>'+info["donorlevel"]+'</td><td>'+info["exp_level"]+'</td><td>'+info["exp_total"]+'</td><td>'+info["exp_perkPoints"]+'</td></tr>');
                            break;
                        case "Vehicles":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["side"]+'</td><td>'+info["classname"]+'</td><td>'+info["type"]+'</td><td>'+info["plate"]+'</td><td>'+info["gear"]+'</td><td>'+info["inventory"]+'</td><td>'+info["insure"]+'</td><td>'+moment(info["insert_time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                            break;
                    }
                };
            }
        },
        error: function(error) {
            return console.log(error);
        }
    });
};

/* ------------------ */
/* /players/topcharts */
/* ------------------ */
function LoadTopCharts(load) {
    const Load = load;
    for (i = 0; i < Load.length; i++) {
        const Server = Load[i].Server;
        const Data = Load[i].Data;
        Data.forEach(function(Category) {
            $.ajax({
                async: true,
                type: 'POST',
                url: '/Players/TopCharts',
                data: {
                    Server: Server,
                    Category: Category
                },
                success: function(data) {
                    if (data.Error !== undefined) {
                        return console.log(data.Error)
                    } else if (data[Category] == false) {
                        $('#'+Category+' > tbody:last-child').append('<tr><td>No Players Found</td></tr>');
                    } else {
                        const Data = data[Category];
                        for (i = 0; i < Data.length; i++) {
                            info = Data[i];
                            switch (Category) {
                                case "Money":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong>'+info["name"]+'</strong></td><td>$'+info["Money"].toLocaleString()+'</td></tr>');
                                    break;
                                case "EXP":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong>'+info["name"]+'</strong></td><td>'+info["exp_level"].toLocaleString()+'</td><td>'+info["exp_total"].toLocaleString()+'</td><td>'+info["exp_perkPoints"].toLocaleString()+'</td></tr>');
                                    break;
                                case "GangFunds":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong>'+info["name"]+'</strong></td><td>$'+info["bank"].toLocaleString()+'</td></tr>');
                                    break;
                                case "Bounty":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong>'+info["wantedName"]+'</strong></td><td>$'+info["wantedBounty"].toLocaleString()+'</td></tr>');
                                    break;
                            }
                        };
                    }
                },
                error: function(error) {
                    return console.log(error);
                }
            });
        });
    }
};

/* ----------------- */
/* /players/killfeed */
/* ----------------- */
function LoadKillFeed() {
    $.ajax({
        async: true,
        type: 'POST',
        url: '/Players/KillFeed',
        data: {
        },
        success: function(data) {
            $('#Kills tbody').empty();
            if (data.Error !== undefined) {
                return console.log(data.Error)
            } else if (data["Kills"] == false) {
                $('#'+Category+' > tbody:last-child').append('<tr><td>No Kills Found</td></tr>');
            } else {
                const Data = data["Kills"];
                for (i = 0; i < Data.length; i++) {
                    info = Data[i];
                    $('#Kills > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td><strong>'+info["KillerName"]+'('+info["KillerGroup"]+')</strong></td><td><strong>'+info["KilledName"]+'('+info["KilledGroup"]+')</strong></td><td>'+info["Weapon"]+'</td><td>'+info["Distance"]+'</td><td>'+moment(info["Time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                };
            }
        },
        error: function(error) {
            return console.log(error);
        }
    });
    
    refreshKillFeed();
};
function refreshKillFeed() {
    setTimeout(function(){
        LoadKillFeed()
    }, 5000);
}