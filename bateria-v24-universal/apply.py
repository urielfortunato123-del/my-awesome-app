from pathlib import Path
import re

root = Path('bateria-build/source/BateriaIA_beta01')
app = root / 'app'

gradle = app / 'build.gradle'
s = gradle.read_text(encoding='utf-8')
s = re.sub(r'minSdk\s+\d+', 'minSdk 29', s)
s = re.sub(r'versionCode\s+\d+', 'versionCode 6', s)
s = re.sub(r"versionName\s+'[^']+'", "versionName '0.2.4-beta02.4-universal'", s)
if 'minifyEnabled true' not in s:
    s = s.replace('release {', "release {\n            minifyEnabled true\n            shrinkResources true\n            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'")
if 'tasks.withType(org.gradle.api.tasks.compile.JavaCompile)' not in s:
    s += "\n\n// Preserve Portuguese accents/cedillas in source strings during release builds.\ntasks.withType(org.gradle.api.tasks.compile.JavaCompile).configureEach {\n    options.encoding = 'UTF-8'\n}\n"
gradle.write_text(s, encoding='utf-8')

manifest = app / 'src/main/AndroidManifest.xml'
m = manifest.read_text(encoding='utf-8')
m = re.sub(r'\s*<uses-permission android:name="android.permission.INTERNET"\s*/>\s*', '\n', m)
m = m.replace('android:allowBackup="true"', 'android:allowBackup="false"')
if 'android:allowBackup=' not in m:
    m = m.replace('<application', '<application\n        android:allowBackup="false"')
if 'android:fullBackupContent=' not in m:
    m = m.replace('android:allowBackup="false"', 'android:allowBackup="false"\n        android:fullBackupContent="false"')
if 'android:usesCleartextTraffic=' not in m:
    m = m.replace('android:fullBackupContent="false"', 'android:fullBackupContent="false"\n        android:usesCleartextTraffic="false"')
manifest.write_text(m, encoding='utf-8')

main = app / 'src/main/java/com/bateriaia/app/MainActivity.java'
j = main.read_text(encoding='utf-8')
j = j.replace('String version = "Beta 02.3";', 'String version = "Beta 02.4 Universal";')
j = j.replace(
    '+ "Tecnologia de inteligência artificial local para análise e gestão de autonomia.\\n\\n"',
    '+ "Tecnologia de inteligência artificial local para análise e gestão de autonomia.\\n"\n'
    '                + "Compatível com Android 10 ou superior e projetado para múltiplas marcas.\\n\\n"'
)
main.write_text(j, encoding='utf-8')

pro = app / 'proguard-rules.pro'
p = pro.read_text(encoding='utf-8')
extra = '''\n# Release privacy/hardening. Do not adapt resource files or string literals.\n-renamesourcefileattribute SourceFile\n-allowaccessmodification\n-keepattributes RuntimeVisibleAnnotations,RuntimeInvisibleAnnotations,AnnotationDefault\n'''
if '-renamesourcefileattribute SourceFile' not in p:
    p += extra
pro.write_text(p, encoding='utf-8')

for path in app.rglob('*'):
    if path.is_file() and path.suffix.lower() in {'.java', '.xml', '.gradle', '.pro'}:
        path.read_text(encoding='utf-8')

assert 'minSdk 29' in gradle.read_text(encoding='utf-8')
assert 'versionCode 6' in gradle.read_text(encoding='utf-8')
assert "versionName '0.2.4-beta02.4-universal'" in gradle.read_text(encoding='utf-8')
assert 'minifyEnabled true' in gradle.read_text(encoding='utf-8')
assert 'shrinkResources true' in gradle.read_text(encoding='utf-8')
assert 'allowBackup="false"' in manifest.read_text(encoding='utf-8')
assert 'usesCleartextTraffic="false"' in manifest.read_text(encoding='utf-8')
assert 'android.permission.INTERNET' not in manifest.read_text(encoding='utf-8')
assert 'Compatível com Android 10 ou superior' in main.read_text(encoding='utf-8')
assert 'MOVA Tecnologia e Mobilidade Ltda.' in main.read_text(encoding='utf-8')
print('Universal 02.4 patch applied; UTF-8 and privacy checks OK')
