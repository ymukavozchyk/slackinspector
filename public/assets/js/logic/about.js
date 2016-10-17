'use strict';

function usageLogic() {
    if (checkToken()) {
        $('#logOutButton').click(logOut);
        $('#logOutButton').removeClass('hidden');
        $('#performAnalysisButton').removeClass('hidden');
    }

    getUsageData();
};

$(document).ready(usageLogic);