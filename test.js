tw.local.HDBD = [];
for (var i=0; i<tw.local.profileApproval.drafProfileInformation.listHopDongBaoDamInfo.length; i++) {
	var item = tw.local.profileApproval.drafProfileInformation.listHopDongBaoDamInfo[i];
	debugger;
//	tw.local.profileApproval.drafProfileInformation.listHopDongBaoDamInfo[0].HDBD02.thongTinChungData.mortgageContractNumber_key
		if(item.documentType == "HDBD_01"){
			tw.local.HDBD.push({
				'name' : "HDBD_01_" + item.HDBD01.thongTinChung.number,
				'value' : "HDBD_01_" + item.HDBD01.thongTinChung.number,
				'HDBD' : item.HDBD01
				}
			)
			tw.local.BM05Object.thongTinChung.HDBDSelected.push({
				'name' : "HDBD_01_" + item.HDBD01.thongTinChung.number,
				'value' : "HDBD_01_" + item.HDBD01.thongTinChung.number,
				'HDBD' : item.HDBD01
				}
			)
		}
	}
console.log(tw.local.HDBD);