var treeList = ['first', 'second', 'third', 'fourth', 'fifth', 'six'];
var tabSize = 4;


document.addEventListener('DOMContentLoaded', () => {
    var doc = document.getElementById('allvoice');
    var btn_comment = document.getElementById("comment");

    btn_comment.addEventListener('click', () => {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        // Lấy startContainer
        var startContainer = range.startContainer;

        //lấy div gần nhất
        var dadDiv = findParentDivRecursive(startContainer);

        //thêm class
        dadDiv.classList.add('first');
    });
    doc.addEventListener('keydown', function (event) {
        //Sự kiện tab
        if (event.key == 'Tab' && !event.shiftKey) {
            event.preventDefault();
            console.log("Tab key pressed");

            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            var dadDiv = findParentDivRecursive(range.startContainer);

            // console.log(dadDiv);
            // console.log(findFirstTextNode(dadDiv));
            // console.log(range.startContainer);
            // console.log(range.startOffset);
            // console.log(range);

            if (range.startContainer === findFirstTextNode(dadDiv) && (range.startOffset === 0 || range.startOffset === 9)) {
                //Không làm gì nếu đây là phần tử root
                if (!dadDiv.previousElementSibling || dadDiv.previousElementSibling.tagName.toLowerCase() !== "div") {
                    console.log("không làm gì");
                    return;
                }
                // Lấy phần tử anh/chị em trước đó của dadDiv
                var previousSibling = dadDiv.previousElementSibling;

                // Kiểm tra xem previousSibling có tồn tại không
                if (previousSibling) {
                    // Tạo một thẻ div mới để bọc firstChild
                    var wrapperDiv = document.createElement('div');
                    // Lấy các class từ dadDiv
                    var currentClasses = dadDiv.className.split(' ');

                    // Lặp qua từng class và kiểm tra xem nó có trong treeList không
                    for (var i = 0; i < currentClasses.length; i++) {
                        var index = treeList.indexOf(currentClasses[i]);
                        if (index !== -1 && index < treeList.length - 1) {
                            // Nếu class hiện tại nằm trong treeList và không phải là phần tử cuối cùng
                            currentClasses[i] = treeList[index + 1];  // Giảm xuống một bậc
                        }
                    }

                    // Gán các class đã giảm cấp cho wrapperDiv
                    wrapperDiv.className = currentClasses.join(' ');

                    // Chèn firstChild vào trong thẻ div mới
                    firstChild = dadDiv.firstChild;
                    firstChild.parentNode.insertBefore(wrapperDiv, firstChild);
                    while (firstChild) {
                        var nextSibling = firstChild.nextSibling;

                        // Kiểm tra nếu firstChild không phải là div
                        if (firstChild.nodeType === Node.ELEMENT_NODE && firstChild.tagName.toLowerCase() !== "div") {
                            wrapperDiv.appendChild(firstChild);
                        }

                        firstChild = nextSibling;
                    }

                    // Di chuyển tất cả các phần tử con còn lại của dadDiv sang previousSibling
                    while (dadDiv.firstChild) {
                        var currentChild = dadDiv.firstChild;

                        // Kiểm tra nếu currentChild có nội dung không rỗng
                        if (currentChild.textContent.trim() !== "") {
                            console.log(currentChild);
                            previousSibling.appendChild(currentChild);
                        } else {
                            // Nếu currentChild có nội dung rỗng, chỉ cần loại bỏ nó khỏi dadDiv
                            dadDiv.removeChild(currentChild);
                        }
                    }

                    // Xóa dadDiv khỏi DOM
                    dadDiv.parentElement.removeChild(dadDiv);
                    // Di chuyển con trỏ chuột đến vị trí của firstChild
                    var range2 = document.createRange();
                    range2.selectNodeContents(wrapperDiv);
                    range2.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range2);
                } else {
                    console.log('No previous sibling found to move children to.');
                }
            }
            else {
                console.log("chạy tab bthg");
                var spaces = '&nbsp;'.repeat(tabSize);
                // Tạo một phần tử tạm thời để chứa khoảng trắng HTML
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = spaces;

                // Lấy đoạn văn bản HTML từ phần tử tạm thời
                var htmlContent = tempDiv.innerHTML;

                var selection = window.getSelection();
                var range = selection.getRangeAt(0);
                var fragment = document.createRange().createContextualFragment(htmlContent);

                if (range.startOffset !== 0) {
                    range.insertNode(fragment);
                    range.collapse(false);
                }
            }
        }

        //sự kiện shift tab
        if (event.key == 'Tab' && event.shiftKey) {
            event.preventDefault();
            console.log("shift tab key pressed");

            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            var dadDiv = findParentDivRecursive(range.startContainer);

            //kiểm tra xem có đúng là ở đầu dòng không
            if (range.startContainer == findFirstTextNode(dadDiv) && range.startOffset == 0) {
                if (dadDiv.className == 'first') {
                    return;
                } else {
                    var newDiv = document.createElement('div');

                    // Sao chép các class từ dadDiv sang newDiv
                    newDiv.className = dadDiv.className;

                    // Lặp qua các phần tử con của dadDiv
                    var child = dadDiv.firstChild;
                    while (child) {
                        var nextChild = child.nextSibling; // Lưu lại tham chiếu đến phần tử tiếp theo
                        // Kiểm tra nếu phần tử không phải là thẻ div
                        if (child.nodeType !== Node.ELEMENT_NODE || child.tagName.toLowerCase() !== 'div') {
                            // Di chuyển phần tử từ dadDiv sang newDiv
                            newDiv.appendChild(child);
                        }
                        child = nextChild;
                    }

                    upgradeClasses(newDiv);

                    //thêm vào các con nếu có
                    while (dadDiv.nextSibling) {
                        var nextSibling = dadDiv.nextSibling; // Lưu lại tham chiếu đến nextSibling
                        newDiv.appendChild(nextSibling);      // Di chuyển nextSibling vào newDiv
                    }
                    console.log(newDiv);

                    var dadDadDiv = dadDiv.parentNode;

                    dadDadDiv.removeChild(dadDiv);
                    dadDadDiv.parentNode.insertBefore(newDiv, dadDadDiv.nextSibling);

                    //chuyển con trỏ chuột sang chỗ mới
                    var tempNode = findFirstTextNode(newDiv);
                    var range2 = document.createRange();
                    range2.selectNodeContents(tempNode);
                    range2.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range2);
                }
            }
        }

        if (event.key == 'Backspace') {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            var dadDiv = findParentDivRecursive(range.startContainer);

            if (range.startContainer == findFirstTextNode(dadDiv) && range.startOffset == 0) {
                console.log(dadDiv.previousElementSibling);
                event.preventDefault();
                if (!dadDiv.previousElementSibling || dadDiv.previousElementSibling.tagName.toLowerCase() !== "div") {
                    console.log("không làm gì");
                    return;
                }

                if (dadDiv.className !== 'first') {
                    // Tạo phần tử mới
                    var newDiv = document.createElement('div');

                    // Sao chép các class từ dadDiv sang newDiv
                    if (dadDiv.className) {
                        newDiv.className = dadDiv.className;
                    }

                    // Sao chép nội dung từ dadDiv sang newDiv
                    if (dadDiv.innerHTML) {
                        newDiv.innerHTML = dadDiv.innerHTML;
                    }

                    // Tăng cấp các lớp của newDiv
                    upgradeClasses(newDiv);

                    // Lấy phần tử cha của dadDiv
                    var dadDadDiv = dadDiv.parentNode;

                    if (dadDadDiv) {
                        // Xóa dadDiv khỏi DOM
                        dadDadDiv.removeChild(dadDiv);

                        // Chèn newDiv vào vị trí của dadDiv
                        dadDadDiv.parentNode.insertBefore(newDiv, dadDadDiv.nextSibling);

                        // Chuyển con trỏ chuột sang vị trí mới trong newDiv
                        var tempNode = findFirstTextNode(newDiv);
                        if (tempNode) {
                            var range2 = document.createRange();
                            range2.selectNodeContents(tempNode);
                            range2.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range2);
                        } else {
                            console.log('No text node found in newDiv to move cursor to.');
                        }
                    } else {
                        console.log('No parent node found for dadDiv.');
                    }
                }
                else {
                    // Lấy phần tử anh/chị em trước đó của dadDiv
                    var previousSibling = dadDiv.previousElementSibling;

                    // Kiểm tra xem previousSibling có tồn tại không
                    if (previousSibling) {
                        // Lấy firstChild của dadDiv (lưu lại để sử dụng sau khi di chuyển)
                        var firstChild = dadDiv.firstChild ? dadDiv.firstChild.nextSibling : null;

                        // Di chuyển tất cả các phần tử con của dadDiv sang previousSibling
                        while (dadDiv.firstChild) {
                            previousSibling.appendChild(dadDiv.firstChild);
                        }

                        // Xóa dadDiv khỏi DOM
                        dadDiv.parentElement.removeChild(dadDiv);

                        // Nếu firstChild tồn tại, di chuyển con trỏ chuột đến vị trí của firstChild
                        if (firstChild) {
                            // firstChild.classList.add('normal');
                            var range2 = document.createRange();
                            range2.selectNodeContents(firstChild);
                            range2.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range2);
                        } else {
                            console.log('No valid firstChild to move cursor to.');
                        }
                    } else {
                        console.log('No previous sibling found to move children to.');
                    }
                }
            }
        }
    });
});


function findParentDivRecursive(element) {
    if (!element) {
        return null;
    }

    if (element.nodeName === 'DIV') {
        return element;
    } else {
        return findParentDivRecursive(element.parentElement);
    }
}

function findFirstTextNode(element) {
    while (element) {
        // Kiểm tra nếu element là một TextNode và không rỗng
        if (element.nodeType === Node.TEXT_NODE && element.textContent.trim() !== "") {
            return element;
        }

        // Nếu có firstChild, đệ quy tìm kiếm trong firstChild
        if (element.firstChild) {
            var found = findFirstTextNode(element.firstChild);
            if (found) {
                return found;
            }
        }

        // Chuyển sang nextSibling nếu textContent rỗng hoặc không phải là TextNode
        element = element.nextSibling;
    }

    // Trả về null nếu không tìm thấy TextNode phù hợp
    return null;
}

function getAllClasses(element) {
    var classes = [];

    // Thu thập các class của element hiện tại
    if (element.className) {
        classes = classes.concat(element.className.split(' '));
    }

    // Lặp qua các phần tử con và đệ quy gọi lại hàm này
    for (var i = 0; i < element.children.length; i++) {
        classes = classes.concat(getAllClasses(element.children[i]));
    }

    return classes;
}

function downgradeClasses(element) {
    // Tách các class hiện tại của phần tử
    var currentClasses = element.className.split(' ');

    // Lặp qua từng class và kiểm tra xem nó có trong treeList không
    for (var i = 0; i < currentClasses.length; i++) {
        var index = treeList.indexOf(currentClasses[i]);
        if (index !== -1 && index < treeList.length - 1) {
            // Nếu class hiện tại nằm trong treeList và không phải là phần tử cuối cùng
            currentClasses[i] = treeList[index + 1];  // Giảm xuống một bậc
        }
    }

    // Gán lại danh sách class đã được chỉnh sửa cho phần tử
    element.className = currentClasses.join(' ');

    // Đệ quy duyệt qua các phần tử con
    for (var j = 0; j < element.children.length; j++) {
        downgradeClasses(element.children[j]);
    }
}

function upgradeClasses(element) {
    // Tách các class hiện tại của phần tử
    var currentClasses = element.className.split(' ');

    // Lặp qua từng class và kiểm tra xem nó có trong treeList không
    for (var i = 0; i < currentClasses.length; i++) {
        var index = treeList.indexOf(currentClasses[i]);
        if (index !== -1 && index > 0) {
            // Nếu class hiện tại nằm trong treeList và không phải là phần tử đầu tiên
            currentClasses[i] = treeList[index - 1];  // Tăng lên một bậc
        } else if (currentClasses[i] === 'first') {
            // Nếu class là 'first', thông báo không thể nâng cấp
            console.log('Class is already first, cannot upgrade');
        }
    }

    // Gán lại danh sách class đã được chỉnh sửa cho phần tử
    element.className = currentClasses.join(' ');

    // Đệ quy duyệt qua các phần tử con
    for (var j = 0; j < element.children.length; j++) {
        upgradeClasses(element.children[j]);
    }
}




var Co_Workaddress = getIncomeDetailListCoMain(coPayerList[i].personalCustomerInformation.cifNumber);
var Spouse_Co_Workaddress = getIncomeDetailListCoSpouse(coPayerList[i].customerSpouseInformation.cifNumber);

var Co_workAddress_String = "";
for (var i = 0; i < Co_Workaddress.length; i++) {
    if (Co_Workaddress[i].workAddress) { // Kiểm tra nếu companyName không rỗng hoặc không undefined
        for (var k = 0; k < Co_Workaddress[i].workAddress.length; k++) {
            Co_workAddress_String += Co_Workaddress[i].workAddress[k].fullAddress + "; ";
        }
    }
}

// Kiểm tra và loại bỏ dấu ; cuối cùng nếu có
if (Co_workAddress_String.lastIndexOf("; ") === Co_workAddress_String.length - 2) {
    Co_workAddress_String = Co_workAddress_String.slice(0, -2); // Bỏ 2 ký tự "; " cuối cùng
}

var Spouse_Co_workAddress_String = "";
for (var i = 0; i < Spouse_Co_Workaddress.length; i++) {
    if (Spouse_Co_Workaddress[i].workAddress) { // Kiểm tra nếu companyName không rỗng hoặc không undefined
        for (var k = 0; k < Spouse_Co_Workaddress[i].workAddress.length; k++) {
            Spouse_Co_workAddress_String += Spouse_Co_Workaddress[i].workAddress[k].fullAddress + "; ";
        }
    }
}

// Kiểm tra và loại bỏ dấu ; cuối cùng nếu có
if (Spouse_Co_workAddress_String.lastIndexOf("; ") === Spouse_Co_workAddress_String.length - 2) {
    Spouse_Co_workAddress_String = Spouse_Co_workAddress_String.slice(0, -2); // Bỏ 2 ký tự "; " cuối cùng
}