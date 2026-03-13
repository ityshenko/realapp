<?php
// Установка зависимостей Node.js через PHP

header('Content-Type: text/html; charset=utf-8');
echo "<h1>🚀 Установка зависимостей...</h1>";
echo "<pre>";

$installDir = __DIR__;

// Команда npm install
echo "📦 Выполняем npm install...\n";
exec("cd {$installDir} && npm install --production 2>&1", $output, $returnCode);
echo implode("\n", $output);
echo "\n";

if ($returnCode === 0) {
    echo "✅ npm install завершен!\n\n";
    
    // Команда prisma generate
    echo "📦 Генерируем Prisma Client...\n";
    exec("cd {$installDir} && npx prisma generate 2>&1", $output2, $returnCode2);
    echo implode("\n", $output2);
    
    if ($returnCode2 === 0) {
        echo "\n✅ Установка завершена успешно!\n";
        echo "🗑️  Скрипт удалится через 5 секунд...\n";
        
        // Удаление этого файла после выполнения
        echo "<script>
            setTimeout(function() {
                window.location.href = 'run-install.php?delete=1';
            }, 5000);
        </script>";
    } else {
        echo "\n❌ Ошибка Prisma generate\n";
    }
} else {
    echo "❌ Ошибка npm install\n";
}

echo "</pre>";

// Удаление файла после выполнения
if (isset($_GET['delete'])) {
    unlink(__FILE__);
    echo "✅ Файл удален";
}
?>
