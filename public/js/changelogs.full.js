/* ----------- */
/* /changelogs */
/* ----------- */
function ChangeLogs(changelogs) {
    for (i = 0; i < changelogs.length; i++) {
        changelog = changelogs[i];
        $('#ChangeLogs').append('<a href="/Changelog/'+changelog["id"]+'"><div class="ChangelogCard"><h2>'+changelog["Name"]+'</h2><h5>'+changelog["Category"]+', '+moment(changelog["Time"]).format('YYYY/MM/DD HH:mm')+'</h5></div></a>');
    }
}