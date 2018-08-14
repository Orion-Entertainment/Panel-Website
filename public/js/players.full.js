/* --------------- */
/* /players/search */
/* --------------- */
function SearchPlayer(searchVal) {
    var searchField = searchVal;
    var ResultsTable = document.getElementById("results");
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
            SearchVal: searchField
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
    var Load = load;
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
                        case "Houses":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No Houses Found</td></tr>');
                            break;
                        case "HouseItems":
                            $('#'+item+' > tbody:last-child').append('<tr><td>No House Items Found</td></tr>');
                            break;
                    }
                } else {
                    var Data = data[item];
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
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td><a href="/Players/Search?q='+info["Killed"]+'">'+info["Name"]+'('+info["KilledGroup"]+')</a></td><td>'+info["Weapon"]+'</td><td>'+info["Time"]+'</td></tr>');
                                break;
                            case "MaldenLife":
                                $('#'+item+' > tbody:last-child').append('<tr><td>$'+info["Money"]+'</td><td>'+info["coplevel"]+'</td><td>'+info["mediclevel"]+'</td><td>'+info["donorlevel"]+'</td><td>'+info["exp_level"]+'</td><td>'+info["exp_total"]+'</td><td>'+info["exp_perkPoints"]+'</td></tr>');
                                break;
                            case "Vehicles":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["side"]+'</td><td>'+info["classname"]+'</td><td>'+info["type"]+'</td><td>'+info["plate"]+'</td><td>'+info["insure"]+'</td><td>'+moment(info["insert_time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                                break;
                            case "Houses":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["id"]+'</td><td>'+info["pos"]+'</td><td>'+moment(info["insert_time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                                break;
                            case "HouseItems":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["classname"]+'</td><td>'+info["pos"]+'</td><td>'+info["Gear"]+'</td><td>'+ info["inventory"]+'</td><td>'+moment(info["insert_time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                                break;
                            case "MoneyLogs":
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Option"]+'</td><td>'+info["toPID"]+'</td><td>'+info["Item"]+'</td><td>'+info["Amount"]+'</td><td>$'+info["Price"].toLocaleString()+'</td><td>'+moment(info["Time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
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
                                $('#KillsText').html('Recent Kills <button type="button" class="btn-sm btn-blue-grey" onClick="getPlayerData('+playerID+',\'Kills\',\'\');">Show Deaths</button>');
                                break;
                            case "":
                                $('#KillsText').html('Recent Kills <button type="button" class="btn-sm btn-elegant" onClick="getPlayerData('+playerID+',\'Kills\',\'All\');">Show Deaths</button>');
                                break;
                        }
                        break;
                    case "MaldenLife":
                        $('#'+item+' > tbody:last-child').append('<tr><td>Player has never joined server</td></tr>');
                        break;
                    case "Vehicles":
                        $('#'+item+' > tbody:last-child').append('<tr><td>No Vehicles Found</td></tr>');
                        break;
                    case "IPs":
                        $('#'+item+' > tbody:last-child').append('<tr><td>Player has never joined server</td></tr>');
                        break;
                }
            } else {
                $('#'+item+' tbody').empty();
                var Data = data[item];
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
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td><a href="/Players/Search?q='+info["Killed"]+'">'+info["Name"]+'('+info["KilledGroup"]+')</a></td><td>'+info["Weapon"]+'</td><td>'+info["Time"]+'</td></tr>');
                            switch (option) {
                                case "All":
                                    $('#KillsText').html('Recent Kills <button type="button" class="btn-sm btn-blue-grey" onClick="getPlayerData('+playerID+',\'Kills\',\'\');">Show Deaths</button>');
                                    break;
                                case "":
                                    $('#KillsText').html('Recent Kills <button type="button" class="btn-sm btn-elegant" onClick="getPlayerData('+playerID+',\'Kills\',\'All\');">Show Deaths</button>');
                                    break;
                            }
                            break;
                        case "MaldenLife":
                            $('#'+item+' > tbody:last-child').append('<tr><td>$'+info["Money"]+'</td><td>'+info["coplevel"]+'</td><td>'+info["mediclevel"]+'</td><td>'+info["donorlevel"]+'</td><td>'+info["exp_level"]+'</td><td>'+info["exp_total"]+'</td><td>'+info["exp_perkPoints"]+'</td></tr>');
                            break;
                        case "Vehicles":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["side"]+'</td><td>'+info["classname"]+'</td><td>'+info["type"]+'</td><td>'+info["plate"]+'</td><td>'+info["insure"]+'</td><td>'+moment(info["insert_time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
                            break;
                        case "IPs":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["IP"]+'</td><td>'+info["Time"]+'</td></tr>');
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
    var Load = load;
    for (i = 0; i < Load.length; i++) {
        var Server = Load[i].Server;
        var Data = Load[i].Data;
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
                        var Data = data[Category];
                        for (i = 0; i < Data.length; i++) {
                            info = Data[i];
                            switch (Category) {
                                case "Money":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong><a href="/Players/Search?q='+info["pid"]+'">'+info["name"]+'</a></strong></td><td>$'+info["Money"].toLocaleString()+'</td></tr>');
                                    break;
                                case "EXP":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong><a href="/Players/Search?q='+info["pid"]+'">'+info["name"]+'</a></strong></td><td>'+info["exp_level"].toLocaleString()+'</td><td>'+info["exp_total"].toLocaleString()+'</td><td>'+info["exp_perkPoints"].toLocaleString()+'</td></tr>');
                                    break;
                                case "GangFunds":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong>'+info["name"]+'</strong></td><td>$'+info["bank"].toLocaleString()+'</td></tr>');
                                    break;
                                case "Bounty":
                                    $('#'+Category+' > tbody:last-child').append('<tr><td><strong><a href="/Players/Search?q='+info["wantedID"]+'">'+info["wantedName"]+'</a></strong></td><td>$'+info["wantedBounty"].toLocaleString()+'</td></tr>');
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
                var Data = data["Kills"];
                for (i = 0; i < Data.length; i++) {
                    info = Data[i];
                    $('#Kills > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td><strong><a href="/Players/Search?q='+info["Killer"]+'">'+info["KillerName"]+'('+info["KillerGroup"]+')</a></strong></td><td><strong><a href="/Players/Search?q='+info["Killed"]+'">'+info["KilledName"]+'('+info["KilledGroup"]+')</a></strong></td><td>'+info["Weapon"]+'</td><td>'+info["Distance"]+'</td><td>'+moment(info["Time"]).format('YYYY/MM/DD HH:mm:ss')+'</td></tr>');
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