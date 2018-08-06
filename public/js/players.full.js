function firstLoad(playerID) {
    const Load = ['Names', 'Bans','Kicks','Kills','MaldenLife'];
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
                                $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Money"]+'</td><td>'+info["coplevel"]+'</td><td>'+info["mediclevel"]+'</td><td>'+info["donorlevel"]+'</td><td>'+info["exp_level"]+'</td><td>'+info["exp_total"]+'</td><td>'+info["exp_perkPoints"]+'</td></tr>');
                                break;
                        }
                    };
                }
            },
            error: function(error) {
                q = 0;
                return alert(error);
            }
        });
    });
};

function getData(playerID,item, option) {
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
                                $('#BansText').text("Current/Expired Bans");
                                break;
                        }
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
                                    $('#BansText').text("Current/Expired Bans");
                                    break;
                            }
                            break;
                        case "Kicks":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Name"]+'</td><td>'+info["Reason"]+'</td><td>'+info["Time"]+'</td></tr>');
                            break;
                        case "Kills":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Server"]+'</td><td>'+info["Name"]+'('+info["KilledGroup"]+')</td><td>'+info["Weapon"]+'</td><td>'+info["Time"]+'</td></tr>');
                            break;
                        case "MaldenLife":
                            $('#'+item+' > tbody:last-child').append('<tr><td>'+info["Money"]+'</td><td>'+info["coplevel"]+'</td><td>'+info["mediclevel"]+'</td><td>'+info["donorlevel"]+'</td><td>'+info["exp_level"]+'</td><td>'+info["exp_total"]+'</td><td>'+info["exp_perkPoints"]+'</td></tr>');
                            break;
                    }
                };
            }
        },
        error: function(error) {
            q = 0;
            return alert(error);
        }
    });
};