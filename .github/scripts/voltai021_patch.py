from pathlib import Path
import xml.etree.ElementTree as ET

root = Path("voltai-build/src021")

# Version bump
build = root / "app/build.gradle"
s = build.read_text(encoding="utf-8")
s = s.replace("versionCode 48", "versionCode 49")
s = s.replace(
    "versionName '0.20.0-voltai-ui-polish-adaptive-user-test-universal'",
    "versionName '0.21.0-voltai-modern-nav-user-test-universal'"
)
build.write_text(s, encoding="utf-8")

# Modern bottom navigation: vector icons instead of font/Unicode glyphs.
layout = root / "app/src/main/res/layout/activity_main.xml"
s = layout.read_text(encoding="utf-8")
start = s.index('    <LinearLayout android:id="@+id/bottomNav"')
end = s.index("    </LinearLayout>\n</LinearLayout>", start) + len("    </LinearLayout>")
nav = """    <LinearLayout
        android:id="@+id/bottomNav"
        android:layout_width="match_parent"
        android:layout_height="78dp"
        android:layout_marginLeft="14dp"
        android:layout_marginRight="14dp"
        android:layout_marginBottom="8dp"
        android:background="@drawable/bg_nav"
        android:gravity="center"
        android:orientation="horizontal"
        android:paddingLeft="6dp"
        android:paddingTop="6dp"
        android:paddingRight="6dp"
        android:paddingBottom="6dp">

        <TextView
            android:id="@+id/tabHome"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="@drawable/bg_nav_selected"
            android:drawableTop="@drawable/ic_nav_home_modern"
            android:drawablePadding="4dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Início"
            android:textColor="@color/nav_active"
            android:textSize="10sp" />

        <TextView
            android:id="@+id/tabAi"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_nav_unselected"
            android:drawableTop="@drawable/ic_nav_consumo_modern"
            android:drawablePadding="4dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Consumo"
            android:textColor="@color/text_secondary"
            android:textSize="10sp" />

        <TextView
            android:id="@+id/tabMova"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_nav_unselected"
            android:drawableTop="@drawable/ic_nav_mova_modern"
            android:drawablePadding="4dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="MOVA"
            android:textColor="@color/text_secondary"
            android:textSize="10sp" />

        <TextView
            android:id="@+id/tabAnalysis"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_nav_unselected"
            android:drawableTop="@drawable/ic_nav_charge_modern"
            android:drawablePadding="4dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Recarga"
            android:textColor="@color/text_secondary"
            android:textSize="10sp" />

        <TextView
            android:id="@+id/tabSettings"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_nav_unselected"
            android:drawableTop="@drawable/ic_nav_more_modern"
            android:drawablePadding="4dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Mais"
            android:textColor="@color/text_secondary"
            android:textSize="10sp" />
    </LinearLayout>"""
layout.write_text(s[:start] + nav + s[end:], encoding="utf-8")

draw = root / "app/src/main/res/drawable"
vectors = {
    "ic_nav_home_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="22dp" android:height="22dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF" android:pathData="M12,3.2L3.4,10.1v9.4c0,0.8 0.7,1.5 1.5,1.5h4.9v-6.1h4.4V21h4.9c0.8,0 1.5,-0.7 1.5,-1.5v-9.4L12,3.2zM18.6,19h-2.4v-6.1H7.8V19H5.4v-7.9L12,5.8l6.6,5.3V19z"/>
</vector>""",
    "ic_nav_consumo_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="22dp" android:height="22dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF" android:pathData="M4,20h3V10H4v10zM10.5,20h3V4h-3v16zM17,20h3v-7h-3v7z"/>
</vector>""",
    "ic_nav_mova_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="22dp" android:height="22dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF" android:pathData="M12,2.7c0.6,4.8 2.5,6.7 7.3,7.3c-4.8,0.6 -6.7,2.5 -7.3,7.3c-0.6,-4.8 -2.5,-6.7 -7.3,-7.3c4.8,-0.6 6.7,-2.5 7.3,-7.3zM18.7,15.2c0.3,2.2 1.2,3.1 3.4,3.4c-2.2,0.3 -3.1,1.2 -3.4,3.4c-0.3,-2.2 -1.2,-3.1 -3.4,-3.4c2.2,-0.3 3.1,-1.2 3.4,-3.4z"/>
</vector>""",
    "ic_nav_charge_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="22dp" android:height="22dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF" android:pathData="M13.3,2L5.6,13.1h5.1L9.8,22l8.6,-12.2h-5.2L13.3,2z"/>
</vector>""",
    "ic_nav_more_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="22dp" android:height="22dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF" android:pathData="M5,6.5h14c0.7,0 1.2,0.5 1.2,1.2S19.7,9 19,9H5C4.3,9 3.8,8.4 3.8,7.7S4.3,6.5 5,6.5zM5,10.8h14c0.7,0 1.2,0.5 1.2,1.2s-0.5,1.2 -1.2,1.2H5c-0.7,0 -1.2,-0.5 -1.2,-1.2s0.5,-1.2 1.2,-1.2zM5,15h14c0.7,0 1.2,0.5 1.2,1.2s-0.5,1.2 -1.2,1.2H5c-0.7,0 -1.2,-0.5 -1.2,-1.2S4.3,15 5,15z"/>
</vector>"""
}
for name, data in vectors.items():
    (draw / name).write_text(data, encoding="utf-8")

(draw / "bg_nav.xml").write_text("""<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape android:shape="rectangle">
            <gradient android:angle="315" android:startColor="#F2162232" android:centerColor="#F00D1724" android:endColor="#F008111D" />
            <corners android:radius="31dp" />
            <stroke android:width="1dp" android:color="#7A4C6B86" />
            <padding android:left="1dp" android:top="1dp" android:right="1dp" android:bottom="1dp" />
        </shape>
    </item>
    <item android:left="2dp" android:top="2dp" android:right="2dp" android:bottom="24dp">
        <shape android:shape="rectangle">
            <gradient android:angle="270" android:startColor="#2EFFFFFF" android:endColor="#00FFFFFF" />
            <corners android:radius="29dp" />
        </shape>
    </item>
</layer-list>
""", encoding="utf-8")

(draw / "bg_nav_selected.xml").write_text("""<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape android:shape="rectangle">
            <gradient android:angle="315" android:startColor="#0BE079" android:centerColor="#08C96E" android:endColor="#03B765" />
            <corners android:radius="23dp" />
            <stroke android:width="1dp" android:color="#5CFFC0" />
        </shape>
    </item>
    <item android:left="1dp" android:top="1dp" android:right="1dp" android:bottom="24dp">
        <shape android:shape="rectangle">
            <gradient android:angle="270" android:startColor="#3DFFFFFF" android:endColor="#00FFFFFF" />
            <corners android:radius="22dp" />
        </shape>
    </item>
</layer-list>
""", encoding="utf-8")

(draw / "bg_nav_unselected.xml").write_text("""<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="#0011171F" />
    <corners android:radius="23dp" />
</shape>
""", encoding="utf-8")

# Update selected/unselected state styling, including icon tint.
main = root / "app/src/main/java/com/bateriaia/app/MainActivity.java"
s = main.read_text(encoding="utf-8")
if "import android.content.res.ColorStateList;" not in s:
    s = s.replace(
        "import android.content.pm.PackageManager;\n",
        "import android.content.pm.PackageManager;\nimport android.content.res.ColorStateList;\n"
    )

start = s.index('        int active = Color.parseColor("#07100D");')
end = s.index("    }\n\n    private void showConsumptionPanel", start)
replacement = """        updateNavItem(tabHome, tab == 0);
        updateNavItem(tabAi, tab == 1);
        updateNavItem(tabAnalysis, tab == 2);
        updateNavItem(tabSettings, tab == 3);
        updateNavItem(tabMova, tab == 4);
    }

    private void updateNavItem(TextView view, boolean selected) {
        int active = Color.parseColor("#06110D");
        int idle = Color.parseColor("#93A5BB");
        int activeIcon = Color.parseColor("#06110D");
        int idleIcon = Color.parseColor("#A8B8CD");
        view.setBackgroundResource(selected ? R.drawable.bg_nav_selected : R.drawable.bg_nav_unselected);
        view.setTextColor(selected ? active : idle);
        view.setCompoundDrawableTintList(ColorStateList.valueOf(selected ? activeIcon : idleIcon));
        view.setAlpha(selected ? 1.0f : 0.86f);
        view.setScaleX(selected ? 1.0f : 0.98f);
        view.setScaleY(selected ? 1.0f : 0.98f);
        view.setTranslationY(selected ? -1.0f : 0.0f);
"""
s = s[:start] + replacement + s[end:]
main.write_text(s, encoding="utf-8")

(root / "RELEASE_NOTES_MV0_21.md").write_text("""# VoltAI 0.21 USER TEST — Modern Bottom Navigation

- versionCode 49
- versionName 0.21.0-voltai-modern-nav-user-test-universal
- barra inferior redesenhada com ícones vetoriais consistentes
- removidos glifos Unicode que variavam conforme a fonte/fabricante
- dock com acabamento escuro translúcido e seleção verde refinada
- ícone e texto do item ativo mudam juntos; inativos ficam discretos
- preservados package com.bateriaia.app, lógica MOVA, cálculos, sincronização e restante da interface 0.20
""", encoding="utf-8")

# Preflight
assert "versionCode 49" in build.read_text(encoding="utf-8")
assert "0.21.0-voltai-modern-nav-user-test-universal" in build.read_text(encoding="utf-8")
page = layout.read_text(encoding="utf-8")
for icon in (
    "ic_nav_home_modern", "ic_nav_consumo_modern", "ic_nav_mova_modern",
    "ic_nav_charge_modern", "ic_nav_more_modern"
):
    assert f'android:drawableTop="@drawable/{icon}"' in page
assert 'android:text="⌂&#10;Início"' not in page
assert 'android:text="◉&#10;Consumo"' not in page
assert 'android:text="✦&#10;MOVA"' not in page
assert 'android:text="☰&#10;Mais"' not in page
assert "setCompoundDrawableTintList" in main.read_text(encoding="utf-8")

for p in (root / "app/src/main/res").rglob("*.xml"):
    ET.parse(p)

print("VoltAI 0.21 modern nav patch: OK")
