start=0
end=$(ls SplitUpdatedDataFixtures/fixture_*.json | wc -l)

for i in $(seq $start $((end - 1))); do
    fixture="SplitUpdatedDataFixtures/fixture_$i.json"
    echo "Loading fixture: $fixture"
    python3 manage.py loaddata $fixture
    echo "Finished loading fixture: $fixture"
done