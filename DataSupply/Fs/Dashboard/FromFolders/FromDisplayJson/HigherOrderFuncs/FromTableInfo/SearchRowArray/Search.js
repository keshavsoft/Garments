let path = require("path");
// let CommonFolders = require("../../../../../../Folders/Show");
// let CommonFiles = require("../../../../../../Files/PullData");
let CommonNewItems = require("../../../../../../Config/Folders/Files/Items/PullData/FromDisplayJson/HigherOrderFuncs/FromTableInfo");
let CommonFolders = require("../../../../../../Config/Folders/PullData/getDirectories");
let CommonFiles = require("../../../../../../Config/Folders/Files/PullData/ListFiles");

let StartFunc = async ({ inUserPK }) => {
    let LocalFoldersData = CommonFolders.StartFunc({ inUserPK });
    let LocalFolderObject;
    let LocalReturnObject = {
        Folders: {}
    };

    LocalFoldersData.forEach(LoopFolderName => {
        LocalReturnObject.Folders[LoopFolderName] = {
            FolderName: LoopFolderName,
            Files: FuncsWithColumns.MainKeys({
                inFilesArray: CommonFiles.StartFunc({ inFolderName: LoopFolderName, inUserPK }),
                inFolderName: LoopFolderName,
                inUserPK
            })
        };

        return LocalFolderObject;
    });

    return LocalReturnObject;
};

class FuncsWithColumns {
    static MainKeys = ({ inFolderName, inFilesArray, inUserPK }) => {
        let LocalReturnObject = {};

        inFilesArray.forEach(LoopFileName => {
            LocalReturnObject[path.parse(LoopFileName).name] = {
                FileName: LoopFileName,
                Items: CommonNewItems.StartFunc({
                    inFolderName,
                    inFileNameWithExtension: LoopFileName,
                    inUserPK,
                    inFuncToRun: this.HigherOrderFuncToRun
                })
            };
        });

        return LocalReturnObject;
    };

    static HigherOrderFuncToRun = ({ inData }) => {
        let LocalLoopObject = {};
        let LocalReturnObject = {};

        Object.entries(inData).forEach(
            ([key, value]) => {
                LocalLoopObject = {};
                LocalLoopObject.ScreenName = key;
                LocalLoopObject.ScreenNameForHtmlId = key.replace(" ", "_");

                if ("TableInfo" in value) {
                    if ("SearchRowArray" in value.TableInfo) {
                        if ("Search" in value.TableInfo.SearchRowArray) {
                            LocalLoopObject.KTF = value.TableInfo.SearchRowArray.Search.KTF;
                            if("DisplayObject" in value.TableInfo.SearchRowArray.Search){
                                LocalLoopObject.DisplayText = value.TableInfo.SearchRowArray.Search.DisplayObject.DisplayText;
                                LocalLoopObject.ColClass = value.TableInfo.SearchRowArray.Search.DisplayObject.ColClass;

                            }
                        }
                    }

                };

                LocalReturnObject[key] = LocalLoopObject;
            }
        );

        return LocalReturnObject;
    }
};

module.exports = {
    StartFunc
};