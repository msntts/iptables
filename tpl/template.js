var tpl = {
    // settings
    settingsLan: function (interface, name) {
        return '<tr class="lan">\n\
                    <td class="pr-2"><input class="form-control input-lg" type="text" value="' + interface + '"/></td>\n\
                    <td><input class="form-control input-block px-2" type="text" value="' + name + '"/></td>\n\
                    <td class="text-center"><button class="close-button" type="button" onclick="tools.removeLan(this);"><svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg></button></td>\n\
                </tr>';
    },

    settingsPort: function (port, name) {
        return '<tr class="port">\n\
                    <td class="pr-2"><input class="form-control input-lg" type="text" value="' + port + '"/></td>\n\
                    <td><input class="form-control input-block" type="text" value="' + name + '"/></td>\n\
                    <td class="text-center"><button class="close-button" type="button" onclick="tools.removeLan(this);"><svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg></button></td>\n\
                </tr>';
    },

    // custom chains menu
    customChain: function (name, table) {
        return '<li><a class="dropdown-item" onclick="rules.showListWithPath(\'' + name + '\', \'' + table + '\');">' + name + " (" + table + ') <button class="close-button" type="button" chainname="' + name + '" chaintable="' + table + '"onclick="rules.removeChain(this);""><svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg></button></a></li>';
    },
    customChainAddNew: '<li class="newchain"><a class="dropdown-item" onclick="rules.addChain();">Add new ...</a></li>',

    // rules
    ruleRow: function (index, text) {
        return "<tr>" +
            '<td class="rowcenter py-2" id="lindx">' + index + "</td>" +
            '<td class="rowright py-2" id="pkts' + index + '"></td>' +
            '<td class="rowright py-2" id="bytes' + index + '"></td>' +
            '<td class="row py-2" id="rule' + index + '"><span class="edittext text-lg">' + text + '<i class="fas fa-edit mx-2" onclick="parser.editRule(' + index + ')"></i></spawn></td>' +
            (index ? '<td class="rowcenter text-center"><a href="#" onclick="return rules.remove(' + index + ');" title="Delete"><svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg></a>' + "</td>" : '<td class="row"></td>') +
            "</tr>";
    },
};

