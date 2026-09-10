from pathlib import Path

root = Path('bateria-build/source/BateriaIA_beta01/app')
java = root / 'src/main/java/com/bateriaia/app/MainActivity.java'
xml = root / 'src/main/res/layout/activity_main.xml'
gradle = root / 'build.gradle'

j = java.read_text()
anchor = '        findViewById(R.id.btnResetAi).setOnClickListener(v -> confirmResetAi());\n    }\n\n    private void refresh(boolean allowInsert) {'
replacement = '''        findViewById(R.id.btnResetAi).setOnClickListener(v -> confirmResetAi());
        findViewById(R.id.btnAbout).setOnClickListener(v -> showAboutDialog());
    }

    private void showAboutDialog() {
        String version = "Beta 02.3";
        try {
            version = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception ignored) {}

        String message = "Desenvolvido por Uriel da Fonseca Fortunato\\n"
                + "MOVA Tecnologia e Mobilidade Ltda.\\n"
                + "CNPJ 57.689.286/0001-81\\n\\n"
                + "Tecnologia de inteligência artificial local para análise e gestão de autonomia.\\n\\n"
                + "Versão: " + version + "\\n"
                + "© 2026 MOVA. Todos os direitos reservados.\\n"
                + "Feito no Brasil.";

        new android.app.AlertDialog.Builder(this)
                .setTitle("Sobre o Bateria IA")
                .setMessage(message)
                .setPositiveButton("Fechar", null)
                .show();
    }

    private void refresh(boolean allowInsert) {'''
if anchor not in j:
    raise SystemExit('MainActivity anchor not found')
java.write_text(j.replace(anchor, replacement))

x = xml.read_text()
reset_line = '                    <TextView android:id="@+id/btnResetAi" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="9dp" android:background="@drawable/bg_button_secondary" android:gravity="center" android:text="Reiniciar aprendizado da IA" android:textColor="@color/text_secondary" android:textSize="13sp" android:textStyle="bold" />'
about_line = reset_line + '\n                    <TextView android:id="@+id/btnAbout" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="9dp" android:background="@drawable/bg_button_secondary" android:gravity="center" android:text="Sobre o Bateria IA" android:textColor="@color/text_primary" android:textSize="13sp" android:textStyle="bold" />'
if reset_line not in x:
    raise SystemExit('Settings button anchor not found')
x = x.replace(reset_line, about_line, 1)

footer_anchor = '                    <TextView android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="5dp" android:text="A IA mede antes de recomendar. Não reduz CPU/GPU escondido e não promete autonomia que os dados não sustentam." android:textColor="@color/text_secondary" android:textSize="12sp" />\n                </LinearLayout>\n            </LinearLayout>'
footer_replacement = '                    <TextView android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="5dp" android:text="A IA mede antes de recomendar. Não reduz CPU/GPU escondido e não promete autonomia que os dados não sustentam." android:textColor="@color/text_secondary" android:textSize="12sp" />\n                </LinearLayout>\n\n                <TextView android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="14dp" android:gravity="center" android:text="Desenvolvido por Uriel da Fonseca Fortunato • MOVA • © 2026" android:textColor="@color/text_secondary" android:textSize="10sp" />\n            </LinearLayout>'
if footer_anchor not in x:
    raise SystemExit('Footer anchor not found')
xml.write_text(x.replace(footer_anchor, footer_replacement, 1))

g = gradle.read_text()
if 'versionCode 4' not in g or "versionName '0.2.2-beta02.2'" not in g:
    raise SystemExit('Version anchor not found')
g = g.replace('versionCode 4', 'versionCode 5')
g = g.replace("versionName '0.2.2-beta02.2'", "versionName '0.2.3-beta02.3'")
gradle.write_text(g)

print('Beta02.3 MOVA identity applied')
