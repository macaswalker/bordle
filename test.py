from borders import borders

# Collect all dictionary keys
key_set = set(borders.keys())

# Build reverse map: neighbour → list of countries that list it
missing_map = {}

for country, neigh_list in borders.items():
    for neigh in neigh_list:
        if neigh not in key_set:
            if neigh not in missing_map:
                missing_map[neigh] = []
            missing_map[neigh].append(country)

# Output
print("Missing neighbours and where they appear:\n")

for missing, sources in sorted(missing_map.items()):
    print(f"❌ {missing}")
    print(f"    Appears in borders of: {', '.join(sources)}\n")

islands = [country for country, neigh in borders.items() if len(neigh) == 0]

print("Countries with no land borders:")
for c in islands:
    print(" -", c)

