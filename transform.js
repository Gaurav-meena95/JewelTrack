const fs = require('fs');

const filePaths = [
    'Backend/module/Auth/controllers.js',
    'Backend/module/Shopkeeper/Billing/controllers.js',
    'Backend/module/Shopkeeper/CustomerRegister/controllers.js',
    'Backend/module/Shopkeeper/Colletral/controllers.js',
    'Backend/module/Shopkeeper/Inventory/controllers.js',
    'Backend/module/Shopkeeper/Orders/controllers.js'
];

filePaths.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const importLevel = filePath.includes('Auth') ? '../../utils/responseHandler' : '../../../utils/responseHandler';
    if (!content.includes('sendResponse')) {
        content = `const { sendResponse } = require('${importLevel}');\n` + content;
    }

    // Now let's try to do it manually using replace_file_content instead of this script.
});
