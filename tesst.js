var identificationMap = {
	"KHAC": "Các loại giấy tờ cá nhân khác",
	"THEC": "Thẻ căn cước",
	"THQN": "Thẻ quân nhân",
	"CMND": "Chứng minh thư",
	"GHCH": "Hộ chiếu",
	"GKHS": "Giấy khai sinh",
	"GPKD": "Giấy phép kinh doanh",
	"GPDT": "Giấy phép đầu tư",
	"GPDN": "QĐ thành lập DN"
};

var lol = true;

try {
	if (!tw.local.MB04Object) {
		tw.local.MB04Object = {};
	}

	if (!tw.local.MB04Object.customerInformation) {
		tw.local.MB04Object.customerInformation = {};
	}
	if (!tw.local.MB04Object.customerInformation.spouseDocumentList) {
		tw.local.MB04Object.customerInformation.spouseDocumentList = [];
	}
	if (!tw.local.MB04Object.customerInformation.documentList) {
		tw.local.MB04Object.customerInformation.documentList = [];
	}
	tw.local.MB04Object.customerInformation.fullName = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.accentedFullName);
	tw.local.MB04Object.customerInformation.permanentAddress = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList[0].fullAddress);
	tw.local.MB04Object.customerInformation.DanhXung_KhachHang = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.gender == "FEMALE" ? "02" : "01");
	var identificationDocuments = tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.identificationDocuments;
	for (var i = 0; i < identificationDocuments.length; i++) {
		var item = identificationDocuments[i];
		var identificationItem = {
			value: item.idType,
			name: identificationMap[item.idType],
			idNumber: item.idNumber,
			issuingAuthority: item.issuePlace,
			issueDate: item.issueDate
		};
		tw.local.MB04Object.customerInformation.documentList.push(identificationItem);
	}
	tw.local.MB04Object.customerInformation.documentType = getString(tw.local.MB04Object.customerInformation.documentList[0].value);
	tw.local.MB04Object.customerInformation.idNumber = getString(tw.local.MB04Object.customerInformation.documentList[0].idNumber);
	tw.local.MB04Object.customerInformation.issuingAuthority = getString(tw.local.MB04Object.customerInformation.documentList[0].issuingAuthority);
	tw.local.MB04Object.customerInformation.issueDate = tw.local.MB04Object.customerInformation.documentList[0].issueDate;
	tw.local.MB04Object.customerInformation.phone = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.contactInformation.phoneNumber);

	// Vợ chồng khách hàng
	var check = tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.maritalStatus == "MARRIED";
	tw.local.MB04Object.customerInformation.spouseCoBorrowerCheck = check;

	if (check) {
		tw.local.MB04Object.customerInformation.spouseName = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.fullName);
		tw.local.MB04Object.customerInformation.spousePermanentAddress = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList[0].fullAddress);
		tw.local.MB04Object.customerInformation.DanhXung_VoChongKhachHang = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.gender == "FEMALE" ? "02" : "01");
		tw.local.MB04Object.customerInformation.spouseDocumentType = getString(tw.local.MB04Object.customerInformation.documentList[0].value);
		tw.local.MB04Object.customerInformation.spouseIdNumber = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.idNumber);
		tw.local.MB04Object.customerInformation.spouseIssuingAuthority = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.identificationDocuments[0].issuePlace);
		tw.local.MB04Object.customerInformation.spouseIssueDate = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.identificationDocuments[0].issueDate;
		tw.local.MB04Object.customerInformation.spousePhone = getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseContactInformation.phoneNumber);
		var identificationDocuments = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.identificationDocuments;
		for (var i = 0; i < identificationDocuments.length; i++) {
			var item = identificationDocuments[i];
			var identificationItem = {
				value: item.idType,
				name: identificationMap[item.idType],
				idNumber: item.idNumber,
				issuingAuthority: item.issuePlace,
				issueDate: item.issueDate
			};
			tw.local.MB04Object.customerInformation.spouseDocumentList.push(identificationItem);
		}
	}

	if (!tw.local.MB04Object.BenPhiaNganHang) {
		tw.local.MB04Object.BenPhiaNganHang = {};
		tw.local.MB04Object.BenPhiaNganHang.branchName = getString(tw.local.branchObject.register_business_name);
		tw.local.MB04Object.BenPhiaNganHang.address = tw.local.branchObject.address;
		if (tw.local.branchObject) {
			tw.local.MB04Object.BenPhiaNganHang.branchName = getString(tw.local.branchObject.register_business_name);
			tw.local.MB04Object.BenPhiaNganHang.address = getString(tw.local.branchObject.register_business_address);
			//			tw.local.MB04Object.BenPhiaNganHang. = getString(tw.local.branchObject.phonenumber);

			if (tw.local.branchObject.changement || tw.local.branchObject.changement_date) {
				tw.local.MB04Object.BenPhiaNganHang.taxCode = "Số " + getString(tw.local.branchObject.dkkd) + " do " + getString(tw.local.branchObject.issue_place) + " cấp lần đầu ngày " + getString(dateToString(tw.local.branchObject.first_issue_date)) + ", đăng ký thay đổi lần thứ " + getString(tw.local.branchObject.changement) + " ngày " + getString(dateToString(tw.local.branchObject.changement_date)) + "";
			} else {
				tw.local.MB04Object.BenPhiaNganHang.taxCode = "Số " + getString(tw.local.branchObject.dkkd) + " do " + getString(tw.local.branchObject.issue_place) + " cấp lần đầu ngày " + getString(dateToString(tw.local.branchObject.first_issue_date)) + "";
			}
		}
	}

	if (!tw.local.MB04Object.Dieu1) {
		tw.local.MB04Object.Dieu1 = [];
		var TSDBList = tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets;
		var lenTSDB = TSDBList.length;
		for (var i = 0; i < lenTSDB; i++) {
			var dieu1Item = {
				value: getString(i),
				name: TSDBList[i].assetCodeDocumentNumber,
				coverNumber: TSDBList[i].GCQNumber,
				issuingAuthority1: TSDBList[i].issuePlace,
				issueDateDieu1: TSDBList[i].issueDate
			};
			tw.local.MB04Object.Dieu1.push(dieu1Item);
		}
	}
} catch (error) {
	console.error("Error mapping data to MB04Object:", error);
}


console.log(tw.local.MB04Object);
console.log("thành log");




function getString(str) {
	if (typeof str === 'number') {
		return str.toString();
	}
	return !!str ? str : "";
}

//function dateToString(date) {
//    return date != null ? date.format("dd/MM/yyyy", "GMT+07:00") : "";
//}

function dateToString(date) {
	return date instanceof Date ? date.toLocaleDateString("vi-VN") : "";
}

function convertStringtoNumber(str) {
	try {
		str = str == null ? "" : str.trim();
		if (str != "") {
			var numberTmp = isNaN(Number(str)) == false ? Number(str) : null;
			return numberTmp;
		}
		return null;
	} catch (e) {
		return null;
	}
}

function formatVietnameseCurrency(input) {
	if (!input) {
		return '0';
	}
	// Chuyển chuỗi đầu vào thành số
	var number = convertStringtoNumber(input);

	// Kiểm tra nếu không phải số hợp lệ
	if (isNaN(number)) {
		return '0';
	}

	// Chuyển số thành chuỗi và lấy phần nguyên, phần thập phân (nếu có)
	var [integerPart, decimalPart] = number.toFixed(2).split(".");

	// Thêm dấu phân cách hàng nghìn thủ công
	var formattedInteger = "";
	for (var i = integerPart.length - 1, counter = 1; i >= 0; i--, counter++) {
		formattedInteger = integerPart[i] + formattedInteger;
		if (counter % 3 === 0 && i !== 0) {
			formattedInteger = "," + formattedInteger;
		}
	}

	// Kết hợp phần nguyên và phần thập phân (nếu có)
	var result = formattedInteger;
	if (decimalPart && decimalPart !== "00") {
		result += "." + decimalPart;
	}

	// Thêm ký hiệu tiền tệ
	return result;
}


